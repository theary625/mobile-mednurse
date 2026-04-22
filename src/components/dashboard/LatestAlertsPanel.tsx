import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ClipboardCheck, Bell, ChevronRight } from 'lucide-react';
import { buttonInteractions } from '@/lib/buttonStyles';

interface AlertItem {
  id: string;
  title: string;
  icon: 'refresh' | 'clipboard' | 'bell';
  iconStyle: 'amber' | 'red' | 'blue' | 'teal';
  timestamp: string;
  secondaryTime?: string;
}

interface LatestAlertsPanelProps {
  alerts?: AlertItem[];
  title?: string;
  showViewAll?: boolean;
  showHeaderChevron?: boolean;
}

const defaultAlerts: AlertItem[] = [
  { id: '1', title: 'Heparin dosing update', icon: 'refresh', iconStyle: 'amber', timestamp: '2 hrs ago' },
  { id: '2', title: 'Verify IV site', icon: 'bell', iconStyle: 'red', timestamp: '4 hrs ago' },
];

const secondaryAlerts: AlertItem[] = [
  { id: '3', title: 'Heparin dosing', icon: 'refresh', iconStyle: 'teal', timestamp: '2 hrs ago', secondaryTime: '2 hrs' },
  { id: '4', title: 'Verify IV site', icon: 'clipboard', iconStyle: 'blue', timestamp: '4 hrs ago', secondaryTime: '4 hrs' },
];

const getAlertIcon = (iconType: string, iconStyle: string) => {
  const colorClass = {
    amber: 'text-[#f39c12]',
    red: 'text-[#e53935]',
    blue: 'text-[#355a86]',
    teal: 'text-[#355a86]',
  }[iconStyle] || 'text-[#f39c12]';

  switch (iconType) {
    case 'refresh':
      return <RefreshCw className={`h-5 w-5 ${colorClass}`} />;
    case 'clipboard':
      return <ClipboardCheck className={`h-5 w-5 ${colorClass}`} />;
    default:
      return <Bell className={`h-5 w-5 ${colorClass}`} />;
  }
};

const getAlertBgClasses = (iconStyle: string) => {
  return {
    amber: 'bg-[#ffb74d]/20 ring-1 ring-[#ffb74d]/35',
    red: 'bg-[#e53935]/10 ring-1 ring-[#e53935]/20',
    blue: 'bg-[#eef1f6] ring-1 ring-black/5',
    teal: 'bg-[#eef1f6] ring-1 ring-black/5',
  }[iconStyle] || 'bg-[#ffb74d]/20 ring-1 ring-[#ffb74d]/35';
};

const LatestAlertsPanel = ({
  alerts = defaultAlerts,
  title = 'Latest Alerts',
  showViewAll = true,
  showHeaderChevron = true,
}: LatestAlertsPanelProps) => {
  return (
    <div className="rounded-[22px] border border-black/5 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(18,18,18,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-black/75">{title}</h3>
        {showHeaderChevron && (
          <Link
            to="/dashboard/alerts"
            className="text-black/35 hover:text-black/50 transition-colors"
            aria-label="Open alerts"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Alert Items */}
      <div className="space-y-0">
        {alerts.map((alert, index) => (
          <React.Fragment key={alert.id}>
            {index > 0 && <div className="h-px bg-black/5 my-3" />}
            <Link
              to="/dashboard/alerts"
              className="flex items-center gap-3 py-1 hover:opacity-80 transition-opacity group"
            >
              <div
                className={`h-11 w-11 rounded-full ${getAlertBgClasses(alert.iconStyle)} grid place-items-center flex-shrink-0`}
              >
                {getAlertIcon(alert.icon, alert.iconStyle)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-black/70 truncate">{alert.title}</p>
                <p className="text-[13px] text-black/40">{alert.timestamp}</p>
              </div>

              {alert.secondaryTime && (
                <span className="text-[13px] text-black/40">{alert.secondaryTime}</span>
              )}
            </Link>
          </React.Fragment>
        ))}
      </div>

      {/* View All Button */}
      {showViewAll && (
        <Link
          to="/dashboard/alerts"
          className={`mt-4 flex w-full items-center justify-center rounded-full bg-black/5 py-3 text-[14px] font-semibold text-black/60 ring-1 ring-black/5 hover:bg-black/10 transition-colors ${buttonInteractions.subtle}`}
        >
          View All
        </Link>
      )}
    </div>
  );
};

// Secondary alerts panel for bottom of sidebar
export const AlertsLinkPanel = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref}>
      <LatestAlertsPanel
        title="Latest Alerts"
        alerts={secondaryAlerts}
        showViewAll={false}
        showHeaderChevron={false}
      />
    </div>
  );
});
AlertsLinkPanel.displayName = 'AlertsLinkPanel';

// Simple alerts link at bottom
export const AlertsQuickLink = React.forwardRef<HTMLAnchorElement>((_, ref) => {
  return (
    <Link
      ref={ref}
      to="/dashboard/alerts"
      className={`flex items-center justify-between rounded-[22px] border border-black/5 bg-white px-6 py-4 shadow-[0_18px_45px_rgba(18,18,18,0.10)] hover:bg-black/[0.02] transition-colors ${buttonInteractions.subtle}`}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-black/5 grid place-items-center">
          <Bell className="h-5 w-5 text-black/50" />
        </div>
        <span className="text-[18px] font-semibold text-black/75">Alerts</span>
      </div>
      <ChevronRight className="h-5 w-5 text-black/35" />
    </Link>
  );
});
AlertsQuickLink.displayName = 'AlertsQuickLink';

export default LatestAlertsPanel;
