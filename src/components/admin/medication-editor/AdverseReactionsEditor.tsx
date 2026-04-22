import { Label } from "@/components/ui/label";
import StringListEditor from "./StringListEditor";

export interface AdverseReactions {
  common: string[];
  serious: string[];
}

interface Props {
  reactions: AdverseReactions;
  onChange: (reactions: AdverseReactions) => void;
}

export default function AdverseReactionsEditor({ reactions, onChange }: Props) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Adverse Reactions</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 space-y-2">
          <StringListEditor
            label="Common Reactions"
            items={reactions.common}
            onChange={(items) => onChange({ ...reactions, common: items })}
            placeholder="e.g., Headache, Nausea"
          />
        </div>
        <div className="border rounded-lg p-4 border-destructive/30 space-y-2">
          <StringListEditor
            label="Serious Reactions"
            items={reactions.serious}
            onChange={(items) => onChange({ ...reactions, serious: items })}
            placeholder="e.g., Anaphylaxis, Stevens-Johnson"
          />
        </div>
      </div>
    </div>
  );
}
