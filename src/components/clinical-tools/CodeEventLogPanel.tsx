import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Activity,
  Zap,
  Syringe,
  Heart,
  FileText,
  Trash2,
  Download,
  Clock,
  ChevronDown,
  List,
} from 'lucide-react';
import { useState } from 'react';
import type { CodeEvent } from './useCodeEventLog';

interface CodeEventLogPanelProps {
  events: CodeEvent[];
  onDelete?: (id: string) => void;
  onExport?: () => void;
  defaultOpen?: boolean;
}

const getEventIcon = (type: CodeEvent['type']) => {
  switch (type) {
    case 'rhythm': return <Activity className="w-3.5 h-3.5" />;
    case 'shock': return <Zap className="w-3.5 h-3.5" />;
    case 'medication': return <Syringe className="w-3.5 h-3.5" />;
    case 'intervention': return <Heart className="w-3.5 h-3.5" />;
    default: return <FileText className="w-3.5 h-3.5" />;
  }
};

const getEventColor = (type: CodeEvent['type']) => {
  switch (type) {
    case 'rhythm': return 'bg-blue-500';
    case 'shock': return 'bg-yellow-500';
    case 'medication': return 'bg-green-500';
    case 'intervention': return 'bg-purple-500';
    case 'assessment': return 'bg-orange-500';
    default: return 'bg-muted-foreground';
  }
};

const CodeEventLogPanel = ({ events, onDelete, onExport, defaultOpen = false }: CodeEventLogPanelProps) => {
  const [open, setOpen] = useState(defaultOpen);

  if (events.length === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between rounded-xl bg-muted/30">
          <span className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Event Log ({events.length})
          </span>
          <div className="flex items-center gap-2">
            {onExport && (
              <span
                role="button"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onExport();
                }}
              >
                <Download className="w-3 h-3" /> Export
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <ScrollArea className="h-52 border rounded-xl">
          <div className="p-2 space-y-0.5">
            {[...events].reverse().map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/50 group text-sm"
              >
                <Badge className={`${getEventColor(event.type)} text-white h-5 w-5 p-0 flex items-center justify-center`}>
                  {getEventIcon(event.type)}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground w-11 shrink-0">
                  {event.elapsedTime}
                </span>
                <span className="flex-1 text-xs">{event.description}</span>
                <span className="text-[10px] text-muted-foreground shrink-0">{event.timestamp}</span>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={() => onDelete(event.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CodeEventLogPanel;
