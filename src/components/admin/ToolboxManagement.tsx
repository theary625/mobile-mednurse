import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Wrench, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ToolSetting {
  id: string;
  tool_id: string;
  tool_name: string;
  system_category: string;
  is_visible: boolean;
}

const categoryLabels: Record<string, string> = {
  neurological: 'Neurological',
  psychiatric: 'Psychiatric',
  cardiovascular: 'Cardiovascular',
  respiratory: 'Respiratory',
  sepsis: 'Sepsis & Infection',
  critical: 'Critical Care',
  trauma: 'Trauma',
  hematology: 'Hematology',
  pediatric: 'Pediatric',
  renal: 'Renal',
  oncology: 'Oncology',
};

const ToolboxManagement = () => {
  const [tools, setTools] = useState<ToolSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('clinical_tool_settings')
        .select('*')
        .order('system_category', { ascending: true })
        .order('tool_name', { ascending: true });

      if (error) throw error;
      setTools(data || []);
    } catch (error: any) {
      toast({ title: 'Failed to load tools', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (toolId: string, currentVisibility: boolean) => {
    setUpdating(toolId);
    
    try {
      const { error } = await supabase
        .from('clinical_tool_settings')
        .update({ is_visible: !currentVisibility })
        .eq('id', toolId);

      if (error) throw error;

      setTools(prev => 
        prev.map(tool => 
          tool.id === toolId ? { ...tool, is_visible: !currentVisibility } : tool
        )
      );

      toast({ 
        title: `Tool ${!currentVisibility ? 'shown' : 'hidden'}`,
        description: `The tool is now ${!currentVisibility ? 'visible' : 'hidden'} to users.`
      });
    } catch (error: any) {
      toast({ title: 'Failed to update tool', description: error.message, variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  const bulkUpdateCategory = async (category: string, visible: boolean) => {
    const categoryToolIds = tools
      .filter(t => t.system_category === category)
      .map(t => t.id);
    
    if (categoryToolIds.length === 0) return;
    
    setUpdating(category);
    
    try {
      const { error } = await supabase
        .from('clinical_tool_settings')
        .update({ is_visible: visible })
        .in('id', categoryToolIds);

      if (error) throw error;

      setTools(prev => 
        prev.map(tool => 
          tool.system_category === category ? { ...tool, is_visible: visible } : tool
        )
      );

      toast({ 
        title: `Category updated`,
        description: `All tools in ${categoryLabels[category] || category} are now ${visible ? 'visible' : 'hidden'}.`
      });
    } catch (error: any) {
      toast({ title: 'Failed to update category', description: error.message, variant: 'destructive' });
    } finally {
      setUpdating(null);
    }
  };

  const filteredTools = tools.filter(tool =>
    tool.tool_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.tool_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.system_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group tools by category
  const groupedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.system_category]) {
      acc[tool.system_category] = [];
    }
    acc[tool.system_category].push(tool);
    return acc;
  }, {} as Record<string, ToolSetting[]>);

  const visibleCount = tools.filter(t => t.is_visible).length;
  const hiddenCount = tools.filter(t => !t.is_visible).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wrench className="w-6 h-6" />
          Toolbox Management
        </h2>
        <p className="text-muted-foreground mt-1">
          Control which clinical tools are visible to users
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <Badge variant="outline" className="px-3 py-1.5 gap-2">
          <Eye className="w-4 h-4 text-green-500" />
          {visibleCount} Visible
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 gap-2">
          <EyeOff className="w-4 h-4 text-muted-foreground" />
          {hiddenCount} Hidden
        </Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tools by Category */}
      <div className="space-y-6">
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <Card key={category} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {categoryLabels[category] || category}
                  </CardTitle>
                  <CardDescription>
                    {categoryTools.filter(t => t.is_visible).length} of {categoryTools.length} tools visible
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {updating === category ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => bulkUpdateCategory(category, true)}
                        disabled={categoryTools.every(t => t.is_visible)}
                        className="gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Show All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => bulkUpdateCategory(category, false)}
                        disabled={categoryTools.every(t => !t.is_visible)}
                        className="gap-1.5"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        Hide All
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryTools.map((tool) => (
                  <div 
                    key={tool.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      tool.is_visible 
                        ? 'bg-background border-border' 
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${tool.is_visible ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                      <div>
                        <p className={`font-medium ${!tool.is_visible && 'text-muted-foreground'}`}>
                          {tool.tool_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {tool.tool_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {updating === tool.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Switch
                          checked={tool.is_visible}
                          onCheckedChange={() => toggleVisibility(tool.id, tool.is_visible)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No tools found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ToolboxManagement;
