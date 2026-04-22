import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';

interface SessionData {
  totalCompressions: number;
  totalCycles: number;
  totalSeconds: number;
  averageBpm: number;
}

interface CPRSessionSummaryProps {
  session: SessionData;
  onRestart: () => void;
}

const CPRSessionSummary = ({ session, onRestart }: CPRSessionSummaryProps) => {
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const now = new Date();
    
    doc.setFontSize(18);
    doc.text('CPR Session Report', 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${now.toLocaleString()}`, 20, 33);
    
    doc.setDrawColor(200);
    doc.line(20, 38, 190, 38);
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    const data = [
      ['Total Compressions', String(session.totalCompressions)],
      ['Cycles Completed', String(session.totalCycles)],
      ['Total Duration', formatTime(session.totalSeconds)],
      ['Average Rate', `${session.averageBpm} BPM`],
    ];
    
    let y = 48;
    data.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 120, y);
      y += 10;
    });
    
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('AHA Guidelines: 100-120 compressions/min, depth ≥5cm, full recoil', 20, y + 15);
    doc.text('This report is for documentation purposes only.', 20, y + 22);
    
    doc.save(`cpr-session-${now.toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <Card className="border-success/30 bg-success/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Session Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Compressions', value: session.totalCompressions },
            { label: 'Cycles', value: session.totalCycles },
            { label: 'Duration', value: formatTime(session.totalSeconds) },
            { label: 'Avg Rate', value: `${session.averageBpm} BPM` },
          ].map(item => (
            <div key={item.label} className="text-center p-2 bg-background/60 rounded-lg">
              <div className="text-lg font-bold font-mono">{item.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={onRestart} variant="outline" size="sm" className="flex-1 gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            New Session
          </Button>
          <Button onClick={exportPDF} size="sm" className="flex-1 gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CPRSessionSummary;
