import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  Hand,
  Syringe,
  Stethoscope,
  Activity,
  Clock,
  Shield,
  FileText,
  MessageCircle,
  CheckCircle2,
  FlaskConical,
  XCircle,
  Eye,
  Pill,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MedNurseGuideData {
  header?: {
    class?: string;
    main_use?: string;
    route?: string;
  };
  before_you_give?: {
    verify?: string[];
    check?: string[];
    hold_if?: string[];
    review_labs?: string[];
    do_not_give_if?: string[];
  };
  preparation?: {
    form?: string;
    reconstitute?: string | null;
    dilute?: string | null;
    compatible_with?: string[];
    equipment_needed?: string[];
  };
  administration?: {
    dose?: string;
    route?: string;
    give_over?: string;
    special_instructions?: string[];
  };
  what_to_monitor?: {
    monitor?: string[];
    watch_for?: string[];
    stop_if?: string[];
  };
  after_you_give?: {
    reassess_in?: string;
    expected_effect?: string;
    document?: string[];
    follow_up?: string[];
  };
  high_risk_alerts?: {
    alert?: string[];
    common_error?: string[];
    key_warning?: string[];
  };
  patient_teaching?: {
    tell_patient?: string[];
    report_immediately?: string[];
  };
}

interface MedNurseQuickGuideProps {
  guide: MedNurseGuideData;
  medicationName: string;
  highAlert?: boolean;
}

const BulletList = ({ items, color = 'text-foreground' }: { items: string[]; color?: string }) => (
  <ul className="space-y-1">
    {items.map((item, i) => (
      <li key={i} className={cn('flex items-start gap-2 text-sm', color)}>
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const FieldRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2 text-sm">
    <span className="font-medium text-muted-foreground min-w-[80px]">{label}:</span>
    <span>{value}</span>
  </div>
);

const SectionHeader = ({
  number,
  icon,
  label,
  isOpen,
  colorClass,
}: {
  number: number;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  colorClass: string;
}) => (
  <div className={cn('flex items-center justify-between p-3 rounded-lg transition-colors border', colorClass)}>
    <div className="flex items-center gap-2">
      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', colorClass.includes('destructive') ? 'bg-destructive/20' : 'bg-current/10')}>
        <span className="text-xs font-bold">{number}</span>
      </div>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
    <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
  </div>
);

const MedNurseQuickGuide = ({ guide, medicationName, highAlert }: MedNurseQuickGuideProps) => {
  const [openSections, setOpenSections] = useState<string[]>(['before_you_give', 'administration']);

  const toggle = (s: string) =>
    setOpenSections((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const { header, before_you_give, preparation, administration, what_to_monitor, after_you_give, high_risk_alerts, patient_teaching } = guide;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          MedNurse Quick Guide
        </CardTitle>
        <div className="mt-2 space-y-1">
          <p className="font-semibold text-base">{medicationName}</p>
          {header?.class && <FieldRow label="Class" value={header.class} />}
          {header?.main_use && <FieldRow label="Main use" value={header.main_use} />}
          {header?.route && <FieldRow label="Route" value={header.route} />}
        </div>
        <div className="flex gap-2 mt-2">
          {highAlert && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              High-Alert
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        {/* 1. Before You Give */}
        {before_you_give && (
          <Collapsible open={openSections.includes('before_you_give')} onOpenChange={() => toggle('before_you_give')}>
            <CollapsibleTrigger className="w-full">
              <SectionHeader
                number={1}
                icon={<Hand className="w-4 h-4 text-destructive" />}
                label="Before You Give"
                isOpen={openSections.includes('before_you_give')}
                colorClass="bg-destructive/10 hover:bg-destructive/15 border-destructive/20"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-destructive/5 rounded-b-lg border-x border-b border-destructive/20">
                {before_you_give.verify?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1 text-primary">
                      <CheckCircle2 className="w-3 h-3" /> Verify
                    </p>
                    <BulletList items={before_you_give.verify} />
                  </div>
                ) : null}
                {before_you_give.check?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1 text-primary">
                      <Stethoscope className="w-3 h-3" /> Check
                    </p>
                    <BulletList items={before_you_give.check} />
                  </div>
                ) : null}
                {before_you_give.hold_if?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1 text-destructive">
                      <AlertTriangle className="w-3 h-3" /> Hold if
                    </p>
                    <BulletList items={before_you_give.hold_if} color="text-destructive" />
                  </div>
                ) : null}
                {before_you_give.review_labs?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1 text-muted-foreground">
                      <FlaskConical className="w-3 h-3" /> Review labs
                    </p>
                    <BulletList items={before_you_give.review_labs} />
                  </div>
                ) : null}
                {before_you_give.do_not_give_if?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1 text-destructive">
                      <XCircle className="w-3 h-3" /> Do not give if
                    </p>
                    <BulletList items={before_you_give.do_not_give_if} color="text-destructive" />
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 2. Preparation */}
        {preparation && (
          <Collapsible open={openSections.includes('preparation')} onOpenChange={() => toggle('preparation')}>
            <CollapsibleTrigger className="w-full">
              <SectionHeader
                number={2}
                icon={<Syringe className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                label="Preparation"
                isOpen={openSections.includes('preparation')}
                colorClass="bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 border-amber-200 dark:border-amber-800"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-b-lg border-x border-b border-amber-200 dark:border-amber-800">
                {preparation.form && <FieldRow label="Form" value={preparation.form} />}
                {preparation.reconstitute && <FieldRow label="Reconstitute" value={preparation.reconstitute} />}
                {preparation.dilute && <FieldRow label="Dilute" value={preparation.dilute} />}
                {preparation.compatible_with?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Compatible with</p>
                    <BulletList items={preparation.compatible_with} />
                  </div>
                ) : null}
                {preparation.equipment_needed?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Equipment needed</p>
                    <BulletList items={preparation.equipment_needed} />
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 3. Administration */}
        {administration && (
          <Collapsible open={openSections.includes('administration')} onOpenChange={() => toggle('administration')}>
            <CollapsibleTrigger className="w-full">
              <SectionHeader
                number={3}
                icon={<Pill className="w-4 h-4 text-primary" />}
                label="Administration"
                isOpen={openSections.includes('administration')}
                colorClass="bg-primary/10 hover:bg-primary/15 border-primary/20"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-2 bg-primary/5 rounded-b-lg border-x border-b border-primary/20">
                {administration.dose && <FieldRow label="Dose" value={administration.dose} />}
                {administration.route && <FieldRow label="Route" value={administration.route} />}
                {administration.give_over && <FieldRow label="Give over" value={administration.give_over} />}
                {administration.special_instructions?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Special instructions</p>
                    <BulletList items={administration.special_instructions} />
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 4. What to Monitor */}
        {what_to_monitor && (
          <Collapsible open={openSections.includes('what_to_monitor')} onOpenChange={() => toggle('what_to_monitor')}>
            <CollapsibleTrigger className="w-full">
              <SectionHeader
                number={4}
                icon={<Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                label="What to Monitor"
                isOpen={openSections.includes('what_to_monitor')}
                colorClass="bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-b-lg border-x border-b border-blue-200 dark:border-blue-800">
                {what_to_monitor.monitor?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Monitor</p>
                    <BulletList items={what_to_monitor.monitor} />
                  </div>
                ) : null}
                {what_to_monitor.watch_for?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-amber-600">
                      <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Watch for</span>
                    </p>
                    <BulletList items={what_to_monitor.watch_for} />
                  </div>
                ) : null}
                {what_to_monitor.stop_if?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-destructive">
                      <span className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Stop if</span>
                    </p>
                    <BulletList items={what_to_monitor.stop_if} color="text-destructive" />
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 5. After You Give */}
        {after_you_give && (
          <Collapsible open={openSections.includes('after_you_give')} onOpenChange={() => toggle('after_you_give')}>
            <CollapsibleTrigger className="w-full">
              <SectionHeader
                number={5}
                icon={<Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                label="After You Give"
                isOpen={openSections.includes('after_you_give')}
                colorClass="bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-b-lg border-x border-b border-emerald-200 dark:border-emerald-800">
                {after_you_give.reassess_in && <FieldRow label="Reassess in" value={after_you_give.reassess_in} />}
                {after_you_give.expected_effect && <FieldRow label="Expected effect" value={after_you_give.expected_effect} />}
                {after_you_give.document?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Document</p>
                    <BulletList items={after_you_give.document} />
                  </div>
                ) : null}
                {after_you_give.follow_up?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Follow up</p>
                    <BulletList items={after_you_give.follow_up} />
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 6. High-Risk Alerts */}
        {high_risk_alerts && (high_risk_alerts.alert?.length || high_risk_alerts.common_error?.length || high_risk_alerts.key_warning?.length) ? (
          <Collapsible open={openSections.includes('high_risk_alerts')} onOpenChange={() => toggle('high_risk_alerts')}>
            <CollapsibleTrigger className="w-full">
              <SectionHeader
                number={6}
                icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
                label="High-Risk Alerts"
                isOpen={openSections.includes('high_risk_alerts')}
                colorClass="bg-destructive/10 hover:bg-destructive/15 border-destructive/20"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-destructive/5 rounded-b-lg border-x border-b border-destructive/20">
                {high_risk_alerts.alert?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-destructive">Alert</p>
                    <BulletList items={high_risk_alerts.alert} color="text-destructive" />
                  </div>
                ) : null}
                {high_risk_alerts.common_error?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-amber-600">Common error</p>
                    <BulletList items={high_risk_alerts.common_error} />
                  </div>
                ) : null}
                {high_risk_alerts.key_warning?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-destructive">Key warning</p>
                    <BulletList items={high_risk_alerts.key_warning} color="text-destructive" />
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : null}

        {/* 7. Patient Teaching */}
        {patient_teaching && (
          <Collapsible open={openSections.includes('patient_teaching')} onOpenChange={() => toggle('patient_teaching')}>
            <CollapsibleTrigger className="w-full">
              <SectionHeader
                number={7}
                icon={<MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                label="Patient Teaching"
                isOpen={openSections.includes('patient_teaching')}
                colorClass="bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 border-purple-200 dark:border-purple-800"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 space-y-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-b-lg border-x border-b border-purple-200 dark:border-purple-800">
                {patient_teaching.tell_patient?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Tell patient</p>
                    <BulletList items={patient_teaching.tell_patient} />
                  </div>
                ) : null}
                {patient_teaching.report_immediately?.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-destructive">
                      <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Report immediately</span>
                    </p>
                    <BulletList items={patient_teaching.report_immediately} color="text-destructive" />
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

export default MedNurseQuickGuide;
