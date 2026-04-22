import { CheckCircle2, Clock } from 'lucide-react';
import safetyAlertIcon from '@/assets/safety-alert-icon.png';
import { Card, CardContent } from '@/components/ui/card';
import DashboardButton from './DashboardButton';

import { SafetyAlert } from '@/types/clinical';

interface SafetyPanelProps {
  alerts: SafetyAlert[];
  onAcknowledge?: (alertId: string) => void;
}

const SafetyPanel = ({ alerts, onAcknowledge }: SafetyPanelProps) => {
  const unacknowledged = alerts.filter(a => !a.acknowledged);
  const criticalAlerts = unacknowledged.filter(a => a.severity === 'critical');
  const warningAlerts = unacknowledged.filter(a => a.severity === 'warning');
  
  const topAlert = criticalAlerts[0] || warningAlerts[0] || unacknowledged[0];

  if (!topAlert) {
    return (
      <div className="animate-fade-in rounded-[22px] border border-[#B8E8C4] bg-gradient-to-br from-[#F0FFF4] via-[#E8FFE5] to-[#DDFFD8] px-6 py-5 shadow-[0_20px_50px_rgba(60,180,100,0.12),0_8px_24px_rgba(60,180,100,0.08)]">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#4AE880]/25 ring-1 ring-[#22C55E]/40 flex-shrink-0">
            <CheckCircle2 className="h-6 w-6 text-[#16A34A]" />
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-[#1F5C2A]">All Clear</h3>
            <p className="mt-1 text-[15px] text-[#457A4A]">No active safety alerts at this time</p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          cardBg: 'bg-gradient-to-br from-[#FFF0EE] via-[#FFE8E5] to-[#FFDDD8]',
          cardBorder: 'border-[#E8C4BE]',
          cardShadow: 'shadow-[0_20px_50px_rgba(200,100,90,0.15),0_8px_24px_rgba(200,100,90,0.10)]',
          iconBg: 'bg-[#E8847A]/25 ring-1 ring-[#D96B5F]/40',
          iconColor: 'text-[#B84A3F]',
          titleColor: 'text-[#5C2A24]',
          textColor: 'text-[#7A4A42]',
          mutedColor: 'text-[#9A6B62]',
          secondaryBtnBg: 'bg-white/80 ring-[#E8C4BE] hover:bg-white',
          secondaryBtnText: 'text-[#5C2A24]',
          secondaryChevronRing: 'ring-[#E8C4BE]',
          secondaryChevronText: 'text-[#7A4A42]'
        };
      case 'warning':
        return {
          cardBg: 'bg-gradient-to-br from-[#FFF7E8] via-[#FFF4D6] to-[#FFF1CC]',
          cardBorder: 'border-[#E8D9B8]',
          cardShadow: 'shadow-[0_20px_50px_rgba(180,140,60,0.15),0_8px_24px_rgba(180,140,60,0.10)]',
          iconBg: 'bg-[#F3B84F]/25 ring-1 ring-[#F2B94B]/40',
          iconColor: 'text-[#D4940A]',
          titleColor: 'text-[#5C4A1F]',
          textColor: 'text-[#7A6B45]',
          mutedColor: 'text-[#9A8B65]',
          secondaryBtnBg: 'bg-white/80 ring-[#E8D9B8] hover:bg-white',
          secondaryBtnText: 'text-[#5C4A1F]',
          secondaryChevronRing: 'ring-[#E8D9B8]',
          secondaryChevronText: 'text-[#7A6B45]'
        };
      default:
        return {
          cardBg: 'bg-gradient-to-br from-[#F0F7FF] via-[#E8F2FF] to-[#E0EDFF]',
          cardBorder: 'border-[#C4D9E8]',
          cardShadow: 'shadow-[0_20px_50px_rgba(60,120,180,0.12),0_8px_24px_rgba(60,120,180,0.08)]',
          iconBg: 'bg-[#6BA3D9]/25 ring-1 ring-[#5A92C8]/40',
          iconColor: 'text-[#3A6A9A]',
          titleColor: 'text-[#1F3A5C]',
          textColor: 'text-[#45627A]',
          mutedColor: 'text-[#658B9A]',
          secondaryBtnBg: 'bg-white/80 ring-[#C4D9E8] hover:bg-white',
          secondaryBtnText: 'text-[#1F3A5C]',
          secondaryChevronRing: 'ring-[#C4D9E8]',
          secondaryChevronText: 'text-[#45627A]'
        };
    }
  };

  const styles = getSeverityStyles(topAlert.severity);

  return (
    <div className={`animate-fade-in rounded-[22px] border ${styles.cardBorder} ${styles.cardBg} ${styles.cardShadow} px-6 py-5`}>
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 flex-shrink-0">
          <img src={safetyAlertIcon} alt="Safety Alert" className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-[20px] font-semibold ${styles.titleColor} capitalize`}>
            {topAlert.severity} Alert
          </div>
          <div className={`mt-1 text-[15px] leading-6 ${styles.textColor}`}>
            {topAlert.message}
          </div>
          {unacknowledged.length > 1 && (
            <p className={`text-[13px] ${styles.mutedColor} mt-2`}>
              +{unacknowledged.length - 1} more alert{unacknowledged.length > 2 ? 's' : ''}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <DashboardButton to="/dashboard/protocols" variant="primary">
              View Updated Protocol
            </DashboardButton>
            <DashboardButton to="/dashboard/calculate" variant="secondary">
              Recalculate Dose
            </DashboardButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyPanel;
