import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Field {
  key: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
}

interface Props {
  label: string;
  fields: Field[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export default function KeyValueEditor({ label, fields, values, onChange }: Props) {
  const updateValue = (key: string, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field.key} className={`space-y-1.5 ${field.multiline ? "md:col-span-2" : ""}`}>
            <Label className="text-xs text-muted-foreground">{field.label}</Label>
            {field.multiline ? (
              <Textarea
                value={values[field.key] || ""}
                onChange={(e) => updateValue(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="text-sm"
              />
            ) : (
              <Input
                value={values[field.key] || ""}
                onChange={(e) => updateValue(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="text-sm"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
