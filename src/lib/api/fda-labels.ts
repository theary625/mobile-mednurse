import { supabase } from '@/integrations/supabase/client';

export interface DailyMedSearchResult {
  drug_name: string;
  manufacturer: string;
  ndc_codes: string[];
  label_url: string;
  set_id: string;
  last_updated: string;
}

export interface FDALabelData {
  set_id: string;
  nda_number: string;
  application_type: string;
  drug_name: string;
  manufacturer: string;
  revision_date: string;
  source_url: string;

  dosage_and_administration: {
    recommended_dosage: string;
    dose_modifications: string;
    preparation_instructions: string;
    administration_instructions: string;
    raw_text: string;
  };

  warnings_and_precautions: {
    boxed_warning: string | null;
    contraindications: string[];
    warnings: string[];
    precautions: string[];
    raw_text: string;
  };

  pharmacokinetics: {
    absorption: string;
    distribution: string;
    metabolism: string;
    excretion: string;
    half_life: string;
    raw_text: string;
  };

  adverse_reactions: {
    most_common: string[];
    serious: string[];
    postmarketing: string[];
    raw_text: string;
  };

  drug_interactions: Array<{
    drug: string;
    effect: string;
    recommendation: string;
  }>;

  special_populations: {
    pregnancy: string;
    lactation: string;
    pediatric: string;
    geriatric: string;
    renal_impairment: string;
    hepatic_impairment: string;
  };

  storage_handling: string;
  full_markdown: string;
}

type FDALabelsApiResponse<T> = {
  success: boolean;
  error?: string;
  results?: T[];
  data?: T;
};

export const fdaLabelsApi = {
  /**
   * Search DailyMed for FDA labels matching a drug name
   */
  async searchLabels(drugName: string, limit = 10): Promise<FDALabelsApiResponse<DailyMedSearchResult>> {
    const { data, error } = await supabase.functions.invoke('search-dailymed', {
      body: { drugName, limit },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  /**
   * Scrape a specific FDA label by URL or Set ID
   */
  async scrapeLabel(labelUrl?: string, setId?: string): Promise<FDALabelsApiResponse<FDALabelData>> {
    const { data, error } = await supabase.functions.invoke('scrape-fda-label', {
      body: { labelUrl, setId },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  /**
   * Extract structured data from an FDA label URL using AI
   */
  async extractFromFDALabel(medicationId: string): Promise<{ success: boolean; data?: any; fields_populated?: string[]; error?: string }> {
    const { data, error } = await supabase.functions.invoke('extract-fda-label', {
      body: { medicationId },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  /**
   * Pull structured data for a single medication from the OpenFDA API
   */
  async pullFromOpenFDA(medicationId: string): Promise<{
    success: boolean;
    medication?: string;
    fields_populated?: string[];
    set_id?: string;
    not_found?: boolean;
    error?: string;
  }> {
    const { data, error } = await supabase.functions.invoke('pull-openfda-label-data', {
      body: { medicationId },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  /**
   * Get the count of medications that need OpenFDA sync
   */
  async getOpenFDASyncCount(options: { onlyMissingData?: boolean }): Promise<{ success: boolean; totalCount?: number; error?: string }> {
    const { data, error } = await supabase.functions.invoke('batch-openfda-label-sync', {
      body: { ...options, countOnly: true },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  /**
   * Batch sync medications from OpenFDA API
   */
  async batchOpenFDASync(options: { batchSize?: number; offset?: number; onlyMissingData?: boolean }): Promise<{
    success: boolean;
    results?: Array<{ id: string; name: string; success: boolean; error?: string; not_found?: boolean; fields?: string[] }>;
    totalProcessed?: number;
    succeeded?: number;
    failed?: number;
    notFound?: number;
    remaining?: number;
    nextOffset?: number;
    error?: string;
    message?: string;
  }> {
    const { data, error } = await supabase.functions.invoke('batch-openfda-label-sync', {
      body: options,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  /**
   * Batch extract structured data from FDA labels for multiple medications
   */
  async batchExtractFDALabels(options: { batchSize?: number; offset?: number; onlyFullyMissing?: boolean }): Promise<{
    success: boolean;
    results?: Array<{ id: string; name: string; success: boolean; error?: string; fields?: string[] }>;
    totalProcessed?: number;
    succeeded?: number;
    failed?: number;
    remaining?: number;
    nextOffset?: number;
    error?: string;
    message?: string;
  }> {
    const { data, error } = await supabase.functions.invoke('batch-extract-fda-labels', {
      body: options,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  /**
   * Sync scraped label data to a medication record
   */
  async syncLabelToMedication(medicationId: string, labelData: FDALabelData): Promise<{ success: boolean; error?: string }> {
    // Map FDA label data to medication fields
    const updatePayload = {
      fda_label_data: labelData,
      fda_label_url: labelData.source_url,
      fda_label_revision_date: labelData.revision_date,
      fda_set_id: labelData.set_id,
      last_synced_at: new Date().toISOString(),

      // Update core fields if they're empty or if FDA data is more complete
      pharmacokinetics: labelData.pharmacokinetics.raw_text ? {
        absorption: labelData.pharmacokinetics.absorption,
        distribution: labelData.pharmacokinetics.distribution,
        metabolism: labelData.pharmacokinetics.metabolism,
        excretion: labelData.pharmacokinetics.excretion,
        half_life: labelData.pharmacokinetics.half_life,
      } : undefined,

      // Update safety info with boxed warning
      ...(labelData.warnings_and_precautions.boxed_warning && {
        high_alert: true,
      }),
    };

    // Remove undefined fields
    const cleanPayload = Object.fromEntries(
      Object.entries(updatePayload).filter(([, v]) => v !== undefined)
    );

    const { error } = await supabase
      .from('medications')
      .update(cleanPayload)
      .eq('id', medicationId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  },
};
