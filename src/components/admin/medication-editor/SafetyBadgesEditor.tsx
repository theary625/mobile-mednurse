import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export interface SafetyBadge {
  type: string;
  label: string;
}

interface Props {
  badges: SafetyBadge[];
  onChange: (badges: SafetyBadge[]) => void;
}

export default function SafetyBadgesEditor({ badges, onChange }: Props) {
  const addBadge = () => onChange([...badges, { type: "warning", label: "" }]);
  const removeBadge = (i: number) => onChange(badges.filter((_, idx) => idx !== i));
  const updateBadge = (i: number, field: keyof SafetyBadge, value: string) => {
    const updated = [...badges];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Safety Badges</Label>
        <Button type="button" variant="outline" size="sm" onClick={addBadge}>
          <Plus className="h-4 w-4 mr-1" /> Add Badge
        </Button>
      </div>
      {badges.map((badge, i) => (
        <div key={i} className="flex items-center gap-2">
          <Select value={badge.type} onValueChange={(v) => updateBadge(i, "type", v)}>
            <SelectTrigger className="w-40 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="high-alert">High Alert</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="black-box">Black Box</SelectItem>
              <SelectItem value="controlled">Controlled</SelectItem>
            </SelectContent>
          </Select>
          <Input value={badge.label} onChange={(e) => updateBadge(i, "label", e.target.value)} placeholder="Badge label..." className="flex-1 text-sm" />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeBadge(i)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
