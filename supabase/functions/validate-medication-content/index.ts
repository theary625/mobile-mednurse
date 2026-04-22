import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidationFlag {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  section?: string;
  details?: string;
}

interface ValidationResult {
  score: number;
  tier: 'auto_approve' | 'quick_review' | 'full_review' | 'escalated';
  flags: ValidationFlag[];
  checks: {
    fdaConsistency: { passed: boolean; score: number; issues: string[] };
    requiredSections: { passed: boolean; score: number; missing: string[] };
    unitValidation: { passed: boolean; score: number; issues: string[] };
    rateLimits: { passed: boolean; score: number; issues: string[] };
    completeness: { passed: boolean; score: number; percentage: number };
  };
  autoApproveEligible: boolean;
  requiresPharmacistReview: boolean;
}

const REQUIRED_SECTIONS_BY_ROUTE: Record<string, string[]> = {
  IV_Push: ['appropriateness', 'administration', 'post_admin', 'patient_teaching'],
  IV_Infusion: ['appropriateness', 'special_prep', 'administration', 'weaning', 'post_admin'],
  IV_Piggyback: ['appropriateness', 'special_prep', 'administration', 'post_admin'],
  PO: ['appropriateness', 'administration', 'post_admin', 'patient_teaching'],
  IM: ['appropriateness', 'administration', 'post_admin'],
  SubQ: ['appropriateness', 'administration', 'post_admin'],
};

const UNIT_PATTERNS = {
  dose: /(\d+(?:\.\d+)?)\s*(mg|mcg|g|mL|units?|mEq)/i,
  rate: /(\d+(?:\.\d+)?)\s*(mg|mcg|units?|mL|mEq)\s*\/\s*(min|hr|hour|kg)/i,
  concentration: /(\d+(?:\.\d+)?)\s*(mg|mcg|units?|mEq)\s*\/\s*(mL|L)/i,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { medicationId } = body as { medicationId: string };

    if (!medicationId) {
      return new Response(JSON.stringify({ error: "medicationId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch medication with all data
    const { data: medication, error: medErr } = await adminClient
      .from("medications")
      .select("*")
      .eq("id", medicationId)
      .single();

    if (medErr || !medication) {
      return new Response(JSON.stringify({ error: "Medication not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch clinical validation rules
    const { data: rules } = await adminClient
      .from("clinical_validation_rules")
      .select("*")
      .eq("is_active", true);

    // Run validation
    const validationResult = validateMedication(medication, rules || []);

    // Update medication with validation results
    await adminClient
      .from("medications")
      .update({
        validation_results: validationResult,
        review_tier: validationResult.tier,
        ai_confidence_score: validationResult.score,
      })
      .eq("id", medicationId);

    return new Response(JSON.stringify({
      success: true,
      medicationId,
      validation: validationResult,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("validate-medication-content error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Validation failed",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function validateMedication(
  medication: Record<string, unknown>,
  rules: Array<Record<string, unknown>>
): ValidationResult {
  const flags: ValidationFlag[] = [];
  const isHighAlert = medication.high_alert === true;
  const isControlled = medication.controlled_substance === true;

  // Check 1: FDA Consistency
  const fdaCheck = checkFDAConsistency(medication, flags);

  // Check 2: Required Sections
  const sectionsCheck = checkRequiredSections(medication, flags);

  // Check 3: Unit Validation
  const unitCheck = checkUnitValidation(medication, flags);

  // Check 4: Rate Limits (against clinical rules)
  const rateCheck = checkRateLimits(medication, rules, flags);

  // Check 5: Completeness
  const completenessCheck = checkCompleteness(medication, flags);

  // Calculate overall score (weighted average)
  const weights = {
    fdaConsistency: 25,
    requiredSections: 25,
    unitValidation: 15,
    rateLimits: 20,
    completeness: 15,
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const weightedScore = (
    fdaCheck.score * weights.fdaConsistency +
    sectionsCheck.score * weights.requiredSections +
    unitCheck.score * weights.unitValidation +
    rateCheck.score * weights.rateLimits +
    completenessCheck.score * weights.completeness
  ) / totalWeight;

  const score = Math.round(weightedScore);

  // Determine tier based on score and medication type
  let tier: ValidationResult['tier'];
  const hasCriticalFlags = flags.some(f => f.type === 'error');
  const hasWarnings = flags.some(f => f.type === 'warning');

  if (hasCriticalFlags || isHighAlert || isControlled) {
    tier = hasCriticalFlags ? 'escalated' : 'full_review';
  } else if (score >= 95 && !hasWarnings) {
    tier = 'auto_approve';
  } else if (score >= 85) {
    tier = 'quick_review';
  } else {
    tier = 'full_review';
  }

  // Auto-approve eligibility
  const autoApproveEligible = 
    tier === 'auto_approve' &&
    !isHighAlert &&
    !isControlled &&
    !hasCriticalFlags;

  // Pharmacist review required
  const requiresPharmacistReview = 
    isHighAlert ||
    isControlled ||
    hasCriticalFlags ||
    tier === 'escalated';

  return {
    score,
    tier,
    flags,
    checks: {
      fdaConsistency: fdaCheck,
      requiredSections: sectionsCheck,
      unitValidation: unitCheck,
      rateLimits: rateCheck,
      completeness: completenessCheck,
    },
    autoApproveEligible,
    requiresPharmacistReview,
  };
}

function checkFDAConsistency(
  medication: Record<string, unknown>,
  flags: ValidationFlag[]
): { passed: boolean; score: number; issues: string[] } {
  const issues: string[] = [];
  const openfdaData = medication.openfda_data as Record<string, unknown> | null;
  const aiContent = medication.ai_generated_content as Record<string, unknown> | null;

  if (!openfdaData) {
    issues.push("No FDA data available for cross-reference");
    return { passed: false, score: 50, issues };
  }

  if (!aiContent) {
    issues.push("No AI-generated content to validate");
    return { passed: false, score: 50, issues };
  }

  // Check route consistency
  const fdaRoutes = (openfdaData.route as string[]) || [];
  const aiRoutes = Object.keys(aiContent).filter(k => k.includes('IV') || k === 'PO' || k === 'IM' || k === 'SubQ');
  
  for (const route of aiRoutes) {
    const routeType = route.replace('_', ' ').toLowerCase();
    const hasMatchingFDARoute = fdaRoutes.some(r => 
      r.toLowerCase().includes(routeType) || 
      (route.includes('IV') && r.toLowerCase().includes('intravenous'))
    );
    
    if (!hasMatchingFDARoute && fdaRoutes.length > 0) {
      flags.push({
        type: 'warning',
        code: 'FDA_ROUTE_MISMATCH',
        message: `AI generated ${route} guide but FDA routes are: ${fdaRoutes.join(', ')}`,
        section: route,
      });
      issues.push(`Route ${route} not in FDA data`);
    }
  }

  // Check drug class alignment
  const fdaDrugClass = (openfdaData.drug_class as string) || '';
  const aiDrugClass = medication.drug_class as string || '';
  
  if (fdaDrugClass && aiDrugClass && !fdaDrugClass.toLowerCase().includes(aiDrugClass.toLowerCase())) {
    flags.push({
      type: 'info',
      code: 'DRUG_CLASS_DIFF',
      message: `Drug class may differ: FDA="${fdaDrugClass}" vs Record="${aiDrugClass}"`,
    });
    issues.push('Drug class mismatch');
  }

  const score = Math.max(50, 100 - (issues.length * 15));
  return { passed: issues.length === 0, score, issues };
}

function checkRequiredSections(
  medication: Record<string, unknown>,
  flags: ValidationFlag[]
): { passed: boolean; score: number; missing: string[] } {
  const missing: string[] = [];
  const aiContent = medication.ai_generated_content as Record<string, unknown> | null;

  if (!aiContent) {
    flags.push({
      type: 'error',
      code: 'NO_AI_CONTENT',
      message: 'No AI-generated nursing guide content found',
    });
    return { passed: false, score: 0, missing: ['All sections'] };
  }

  // Check each route for required sections
  for (const [route, sections] of Object.entries(REQUIRED_SECTIONS_BY_ROUTE)) {
    if (aiContent[route]) {
      const routeContent = aiContent[route] as Record<string, unknown>;
      for (const section of sections) {
        if (!routeContent[section] || isEmpty(routeContent[section])) {
          missing.push(`${route}.${section}`);
          flags.push({
            type: 'warning',
            code: 'MISSING_SECTION',
            message: `Missing required section: ${section}`,
            section: route,
          });
        }
      }
    }
  }

  const totalRequired = Object.values(REQUIRED_SECTIONS_BY_ROUTE)
    .filter((_, i) => Object.keys(aiContent)[i])
    .flat().length || 1;
  
  const score = Math.round(((totalRequired - missing.length) / totalRequired) * 100);
  return { passed: missing.length === 0, score: Math.max(0, score), missing };
}

function checkUnitValidation(
  medication: Record<string, unknown>,
  flags: ValidationFlag[]
): { passed: boolean; score: number; issues: string[] } {
  const issues: string[] = [];
  const aiContent = medication.ai_generated_content as Record<string, unknown> | null;

  if (!aiContent) {
    return { passed: true, score: 100, issues: [] };
  }

  // Common clinical conversion patterns that are acceptable
  const acceptablePatterns = [
    /\d+\s*g\s*[=/]\s*\d+\s*mg/i,      // "4g = 4000mg"
    /\d+\s*mg\s*[=/]\s*\d+\s*g/i,      // "4000mg = 4g"
    /\d+\s*mcg\s*[=/]\s*\d+\s*mg/i,    // "1000mcg = 1mg"
    /max(imum)?\s*\d+\s*g/i,           // "max 4g/day"
    /\d+\s*-\s*\d+\s*(mg|g|mcg)/i,     // dose ranges
  ];

  const checkString = (str: string, path: string) => {
    // Skip if string contains acceptable conversion patterns
    const hasAcceptablePattern = acceptablePatterns.some(p => p.test(str));
    
    // Check for mixed units that might indicate errors
    const doseMatches = str.match(/\d+\s*(mg|mcg|g)\b/gi);
    if (doseMatches && doseMatches.length > 1 && !hasAcceptablePattern) {
      const units = doseMatches.map(m => m.replace(/\d+\s*/, '').toLowerCase());
      const uniqueUnits = [...new Set(units)];
      // Only flag mg/mcg mixing (not mg/g which is common for daily totals)
      if (uniqueUnits.length > 1 && uniqueUnits.includes('mg') && uniqueUnits.includes('mcg')) {
        flags.push({
          type: 'info',
          code: 'MIXED_UNITS',
          message: `Mixed units detected: ${uniqueUnits.join(', ')} - verify intentional`,
          section: path,
        });
        // Info flags don't count as issues for scoring
      }
    }

    // Check for suspiciously high values (more lenient thresholds)
    const numericValues = str.match(/(\d+(?:,\d{3})*(?:\.\d+)?)\s*(mg|mcg|g|mL)\b/gi);
    if (numericValues) {
      for (const val of numericValues) {
        const match = val.match(/(\d+(?:,\d{3})*(?:\.\d+)?)\s*(mg|mcg|g|mL)/i);
        if (match) {
          const num = parseFloat(match[1].replace(',', ''));
          const unit = match[2].toLowerCase();
          
          // Only flag truly dangerous values (raised thresholds)
          if ((unit === 'mg' && num > 50000) || (unit === 'g' && num > 50)) {
            flags.push({
              type: 'warning',
              code: 'HIGH_DOSE_VALUE',
              message: `Unusually high dose value: ${val} - verify accuracy`,
              section: path,
              details: 'Values this high may indicate a unit error',
            });
            issues.push(`High value at ${path}: ${val}`);
          }
        }
      }
    }
  };

  const traverse = (obj: unknown, path: string = '') => {
    if (typeof obj === 'string') {
      checkString(obj, path);
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => traverse(item, `${path}[${i}]`));
    } else if (obj && typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        traverse(value, path ? `${path}.${key}` : key);
      }
    }
  };

  traverse(aiContent);

  // More generous scoring - only real issues penalize
  const score = issues.length === 0 ? 100 : Math.max(70, 100 - (issues.length * 15));
  return { passed: issues.length === 0, score, issues };
}

function checkRateLimits(
  medication: Record<string, unknown>,
  rules: Array<Record<string, unknown>>,
  flags: ValidationFlag[]
): { passed: boolean; score: number; issues: string[] } {
  const issues: string[] = [];
  const drugClass = (medication.drug_class as string || '').toLowerCase();
  const aiContent = medication.ai_generated_content as Record<string, unknown> | null;

  if (!aiContent || rules.length === 0) {
    return { passed: true, score: 100, issues: [] };
  }

  // Find applicable rules
  const applicableRules = rules.filter(rule => {
    const ruleClass = ((rule.drug_class as string) || '').toLowerCase();
    const rulePattern = ((rule.medication_pattern as string) || '').toLowerCase();
    const medName = (medication.generic_name as string || '').toLowerCase();
    
    return (
      (ruleClass && drugClass.includes(ruleClass)) ||
      (rulePattern && medName.includes(rulePattern))
    );
  });

  // Check IV infusion rates against rules
  for (const rule of applicableRules) {
    if (rule.rule_type === 'rate_limit') {
      const config = rule.rule_config as Record<string, unknown>;
      const maxRate = config.max_rate_mg_min as number;
      
      if (maxRate && aiContent.IV_Infusion) {
        const infusion = aiContent.IV_Infusion as Record<string, unknown>;
        const admin = infusion.administration as Record<string, unknown>;
        
        if (admin?.max_rate) {
          const maxRateStr = String(admin.max_rate);
          const rateMatch = maxRateStr.match(/(\d+(?:\.\d+)?)\s*mg\s*\/?\s*min/i);
          
          if (rateMatch) {
            const aiRate = parseFloat(rateMatch[1]);
            if (aiRate > maxRate) {
              flags.push({
                type: 'error',
                code: 'RATE_EXCEEDS_LIMIT',
                message: `AI rate ${aiRate}mg/min exceeds clinical rule max of ${maxRate}mg/min`,
                section: 'IV_Infusion.administration',
                details: config.description as string,
              });
              issues.push(`Rate limit exceeded for ${rule.drug_class}`);
            }
          }
        }
      }
    }

    if (rule.rule_type === 'required_monitoring') {
      const config = rule.rule_config as Record<string, unknown>;
      const requiredLabs = config.labs as string[];
      
      // Check if AI content mentions required labs
      const aiContentStr = JSON.stringify(aiContent).toLowerCase();
      const missingLabs = requiredLabs?.filter(lab => 
        !aiContentStr.includes(lab.toLowerCase())
      );

      if (missingLabs?.length) {
        flags.push({
          type: 'warning',
          code: 'MISSING_REQUIRED_LABS',
          message: `Required labs not mentioned: ${missingLabs.join(', ')}`,
          details: config.description as string,
        });
        issues.push(`Missing lab references: ${missingLabs.join(', ')}`);
      }
    }
  }

  const hasErrors = issues.some(i => i.includes('exceeded'));
  const score = hasErrors ? 50 : Math.max(70, 100 - (issues.length * 10));
  return { passed: issues.length === 0, score, issues };
}

function checkCompleteness(
  medication: Record<string, unknown>,
  flags: ValidationFlag[]
): { passed: boolean; score: number; percentage: number } {
  const aiContent = medication.ai_generated_content as Record<string, unknown> | null;
  
  // Helper to check if field exists in medication OR in ai_generated_content
  const hasField = (field: string): boolean => {
    if (!isEmpty(medication[field])) return true;
    
    // Check if data exists in ai_generated_content
    if (aiContent) {
      // Map legacy fields to AI content sections
      const aiMappings: Record<string, string[]> = {
        'dosing_info': ['administration', 'dosing'],
        'safety_info': ['appropriateness', 'safety_considerations', 'hold_conditions'],
        'nursing_guide': ['administration', 'post_admin', 'pre_admin'],
        'adverse_reactions': ['adverse_effects', 'monitor_for'],
        'patient_teaching': ['patient_teaching'],
        'monitoring': ['post_admin', 'monitor_for'],
        'hold_parameters': ['hold_conditions', 'appropriateness'],
      };
      
      const keysToCheck = aiMappings[field] || [];
      
      // Check route-based structure: ai_generated_content.{route}.{section}
      for (const routeKey of Object.keys(aiContent)) {
        const routeData = aiContent[routeKey] as Record<string, unknown>;
        if (!routeData || typeof routeData !== 'object') continue;
        
        // Direct route structure (e.g., IV_Push.administration)
        for (const key of keysToCheck) {
          if (!isEmpty(routeData[key])) return true;
        }
        
        // Nested guide structure (e.g., general.guide.PO.administration)
        if (routeData.guide && typeof routeData.guide === 'object') {
          const guideData = routeData.guide as Record<string, unknown>;
          for (const subRoute of Object.keys(guideData)) {
            const subRouteData = guideData[subRoute] as Record<string, unknown>;
            if (!subRouteData || typeof subRouteData !== 'object') continue;
            for (const key of keysToCheck) {
              if (!isEmpty(subRouteData[key])) return true;
              // Check nested objects (e.g., appropriateness.hold_conditions)
              for (const innerKey of Object.keys(subRouteData)) {
                const innerData = subRouteData[innerKey] as Record<string, unknown>;
                if (innerData && typeof innerData === 'object' && !isEmpty(innerData[key])) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  };

  // Core fields required for clinical use (weighted heavily)
  const coreFields = [
    'generic_name',
    'drug_class',
    'route',
    'dosing_info',
    'safety_info',
    'nursing_guide',
  ];

  // Enhanced fields that improve quality but aren't required for auto-approve
  const enhancedFields = [
    'adverse_reactions',
    'hold_parameters',
    'monitoring',
    'patient_education',
  ];

  // Optional enrichment fields (nice to have, minimal scoring impact)
  const optionalFields = [
    'pronunciation_text',
    'clinical_pearls',
    'image_url',
  ];

  let coreScore = 0;
  let enhancedScore = 0;
  let optionalScore = 0;

  for (const field of coreFields) {
    if (hasField(field)) coreScore++;
  }

  for (const field of enhancedFields) {
    if (hasField(field)) enhancedScore++;
  }

  for (const field of optionalFields) {
    if (!isEmpty(medication[field])) optionalScore++;
  }

  // Weighted scoring: core=60%, enhanced=30%, optional=10%
  const corePercent = (coreScore / coreFields.length) * 60;
  const enhancedPercent = (enhancedScore / enhancedFields.length) * 30;
  const optionalPercent = (optionalScore / optionalFields.length) * 10;
  
  const percentage = Math.round(corePercent + enhancedPercent + optionalPercent);
  
  if (percentage < 50) {
    flags.push({
      type: 'warning',
      code: 'LOW_COMPLETENESS',
      message: `Data completeness is only ${percentage}%`,
      details: 'Consider running FDA sync and guide generation',
    });
  }

  // Pass if all core fields are present
  const coreComplete = coreScore === coreFields.length;

  return {
    passed: coreComplete && percentage >= 70,
    score: percentage,
    percentage,
  };
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
