import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronUp, ChevronDown, Calculator, Pill, Clock, Users, Shield, Award, Check, Star } from 'lucide-react';

export type ArrayFieldType = 'label' | 'href' | 'description' | 'external' | 'icon' | 'title';

export interface ArrayItem {
  label?: string;
  title?: string;
  href?: string;
  description?: string;
  external?: boolean;
  icon?: string;
}

interface ArrayFieldEditorProps {
  items: ArrayItem[];
  onChange: (items: ArrayItem[]) => void;
  fields: ArrayFieldType[];
  maxItems?: number;
  itemLabel?: string;
}

const iconOptions = [
  { value: 'calculator', label: 'Calculator', Icon: Calculator },
  { value: 'pill', label: 'Pill', Icon: Pill },
  { value: 'clock', label: 'Clock', Icon: Clock },
  { value: 'users', label: 'Users', Icon: Users },
  { value: 'shield', label: 'Shield', Icon: Shield },
  { value: 'award', label: 'Award', Icon: Award },
  { value: 'check', label: 'Check', Icon: Check },
  { value: 'star', label: 'Star', Icon: Star },
];

const ArrayFieldEditor = ({ 
  items, 
  onChange, 
  fields, 
  maxItems = 10,
  itemLabel = 'Item'
}: ArrayFieldEditorProps) => {
  const handleItemChange = (index: number, field: keyof ArrayItem, value: string | boolean) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const addItem = () => {
    if (items.length >= maxItems) return;
    const newItem: ArrayItem = {};
    if (fields.includes('label')) newItem.label = '';
    if (fields.includes('title')) newItem.title = '';
    if (fields.includes('href')) newItem.href = '';
    if (fields.includes('description')) newItem.description = '';
    if (fields.includes('external')) newItem.external = false;
    if (fields.includes('icon')) newItem.icon = 'calculator';
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Card key={index} className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-1 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Fields */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {itemLabel} {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="h-8 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {fields.includes('icon') && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Icon</Label>
                      <Select
                        value={item.icon || 'calculator'}
                        onValueChange={(value) => handleItemChange(index, 'icon', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex items-center gap-2">
                                <opt.Icon className="h-4 w-4" />
                                {opt.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {fields.includes('title') && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={item.title || ''}
                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                        placeholder="Title text"
                        className="h-9"
                      />
                    </div>
                  )}

                  {fields.includes('label') && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={item.label || ''}
                        onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                        placeholder="Link text"
                        className="h-9"
                      />
                    </div>
                  )}

                  {fields.includes('href') && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">URL</Label>
                      <Input
                        value={item.href || ''}
                        onChange={(e) => handleItemChange(index, 'href', e.target.value)}
                        placeholder="/path or https://..."
                        className="h-9"
                      />
                    </div>
                  )}
                </div>

                {fields.includes('description') && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={item.description || ''}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Brief description"
                      className="h-9"
                    />
                  </div>
                )}

                {fields.includes('external') && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.external || false}
                      onCheckedChange={(checked) => handleItemChange(index, 'external', checked)}
                    />
                    <Label className="text-xs">Opens in new tab</Label>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        disabled={items.length >= maxItems}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Add {itemLabel}
      </Button>

      {items.length >= maxItems && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum of {maxItems} items reached
        </p>
      )}
    </div>
  );
};

export default ArrayFieldEditor;
