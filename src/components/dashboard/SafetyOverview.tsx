import { ClipboardCheck, Info } from 'lucide-react';

interface SafetyOverviewProps {
  checksCompleted?: number;
  protocolsUpToDate?: boolean;
  unresolvedAlerts?: number;
}

const SafetyOverview = ({ 
  checksCompleted = 6, 
  protocolsUpToDate = true,
  unresolvedAlerts = 0 
}: SafetyOverviewProps) => {
  return (
    <div className="rounded-[22px] border border-black/5 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Safety Overview</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {checksCompleted} Medication Checks Completed Today
        </p>
      </div>
      
      <div className="flex items-start gap-4 rounded-2xl bg-muted/30 p-4 ring-1 ring-black/5">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#4ade80]/20 ring-1 ring-[#22c55e]/35">
          <ClipboardCheck className="h-6 w-6 text-[#16a34a]" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">
            {checksCompleted - 1} Medication Checks <span className="italic text-muted-foreground">Complete!</span> 💚 
            <span className="ml-1">no unresolved alerts.</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {protocolsUpToDate 
              ? 'You are using the latest protocols, no unresolved alerts' 
              : `${unresolvedAlerts} unresolved alert${unresolvedAlerts !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyOverview;