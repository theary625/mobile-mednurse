import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Clock } from 'lucide-react';
import { SafetyAlert } from '@/types/clinical';

const AlertsPage = () => {
  // Demo alerts - in real app, fetch from database
  const [alerts, setAlerts] = useState<SafetyAlert[]>([
    {
      id: '1',
      user_id: '',
      alert_type: 'high_alert',
      severity: 'warning',
      message: 'Heparin protocol update: New weight-based dosing guidelines effective today. Review before next administration.',
      acknowledged: false,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: '',
      alert_type: 'timing',
      severity: 'info',
      message: 'Reminder: Vancomycin trough level due in 2 hours for patient in room 412.',
      acknowledged: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      user_id: '',
      alert_type: 'dose_range',
      severity: 'critical',
      message: 'Metformin dose exceeds recommended maximum for patient with CrCl 28 mL/min. Consider dose reduction.',
      acknowledged: true,
      acknowledged_at: new Date(Date.now() - 7200000).toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId 
        ? { ...a, acknowledged: true, acknowledged_at: new Date().toISOString() }
        : a
    ));
  };

  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertCircle;
      default: return Info;
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-destructive bg-destructive/5';
      case 'warning': return 'border-l-warning bg-warning/5';
      default: return 'border-l-info bg-info/5';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const AlertCard = ({ alert }: { alert: SafetyAlert }) => {
    const Icon = getSeverityIcon(alert.severity);
    
    return (
      <Card className={`border-l-4 ${getSeverityStyles(alert.severity)} border-border/50 shadow-soft rounded-2xl overflow-hidden`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              alert.severity === 'critical' ? 'bg-destructive/10' :
              alert.severity === 'warning' ? 'bg-warning/10' : 'bg-info-glow'
            }`}>
              <Icon className={`w-6 h-6 ${
                alert.severity === 'critical' ? 'text-destructive' :
                alert.severity === 'warning' ? 'text-warning' : 'text-info'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={
                    alert.severity === 'critical' ? 'destructive' :
                    alert.severity === 'warning' ? 'secondary' : 'outline'
                  } className="capitalize rounded-lg">
                    {alert.severity}
                  </Badge>
                  <Badge variant="outline" className="capitalize rounded-lg">
                    {alert.alert_type.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(alert.created_at)}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{alert.message}</p>
              
              {!alert.acknowledged && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-4 rounded-xl"
                  onClick={() => handleAcknowledge(alert.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Acknowledge
                </Button>
              )}
              
              {alert.acknowledged && alert.acknowledged_at && (
                <p className="text-xs text-muted-foreground mt-3">
                  Acknowledged {formatTime(alert.acknowledged_at)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-glow text-accent rounded-full text-sm font-medium mb-3">
            <Bell className="w-4 h-4" />
            <span>Safety Alerts</span>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">Alerts & Reminders</h1>
          <p className="text-muted-foreground mt-2">Safety alerts and clinical reminders</p>
        </div>
        {activeAlerts.length > 0 && (
          <Badge variant="destructive" className="gap-2 px-4 py-2 rounded-xl text-sm">
            <Bell className="w-4 h-4" />
            {activeAlerts.length} Active
          </Badge>
        )}
      </div>

      <Tabs defaultValue="active">
        <TabsList className="rounded-xl bg-muted/50 p-1">
          <TabsTrigger value="active" className="gap-2 rounded-lg">
            <Clock className="w-4 h-4" />
            Active ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="acknowledged" className="gap-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            Acknowledged ({acknowledgedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6 space-y-4">
          {activeAlerts.length === 0 ? (
            <Card className="py-12 border-border/50 shadow-soft rounded-2xl">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 rounded-2xl bg-success-glow flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <p className="font-semibold text-foreground">No active alerts</p>
                <p className="text-sm mt-1">All caught up!</p>
              </div>
            </Card>
          ) : (
            activeAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>

        <TabsContent value="acknowledged" className="mt-6 space-y-4">
          {acknowledgedAlerts.length === 0 ? (
            <Card className="py-12 border-border/50 shadow-soft rounded-2xl">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 opacity-50" />
                </div>
                <p className="font-medium">No acknowledged alerts</p>
              </div>
            </Card>
          ) : (
            acknowledgedAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsPage;
