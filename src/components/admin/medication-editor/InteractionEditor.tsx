import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export interface DrugInteraction {
  drug: string;
  severity: string;
  effect: string;
  recommendation?: string;
}

interface Props {
  interactions: DrugInteraction[];
  onChange: (interactions: DrugInteraction[]) => void;
}

const emptyInteraction: DrugInteraction = { drug: "", severity: "moderate", effect: "", recommendation: "" };

export default function InteractionEditor({ interactions, onChange }: Props) {
  const addInteraction = () => {
    onChange([...interactions, { ...emptyInteraction }]);
  };

  const updateInteraction = (index: number, field: keyof DrugInteraction, value: string) => {
    const updated = [...interactions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeInteraction = (index: number) => {
    onChange(interactions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Drug Interactions</Label>
        <Button type="button" variant="outline" size="sm" onClick={addInteraction}>
          <Plus className="h-4 w-4 mr-1" /> Add Interaction
        </Button>
      </div>
      {interactions.length === 0 && (
        <p className="text-sm text-muted-foreground py-2">No interactions added yet.</p>
      )}
      {interactions.map((interaction, i) => (
        <Card key={i} className="relative">
          <CardContent className="pt-4 pb-3 space-y-3">
            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeInteraction(i)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Drug Name</Label>
                <Input value={interaction.drug} onChange={(e) => updateInteraction(i, "drug", e.target.value)} placeholder="e.g., Warfarin" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Severity</Label>
                <Select value={interaction.severity} onValueChange={(v) => updateInteraction(i, "severity", v)}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="contraindicated">Contraindicated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Effect</Label>
              <Textarea value={interaction.effect} onChange={(e) => updateInteraction(i, "effect", e.target.value)} placeholder="Describe the interaction effect..." rows={2} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Recommendation</Label>
              <Input value={interaction.recommendation || ""} onChange={(e) => updateInteraction(i, "recommendation", e.target.value)} placeholder="e.g., Monitor INR closely" className="text-sm" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
