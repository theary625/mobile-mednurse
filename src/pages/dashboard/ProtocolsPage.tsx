import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Search,
  Sparkles,
  Heart,
  Brain,
  Activity,
  Baby,
  Siren,
  Clock,
  ChevronRight,
  BookOpen,
  CheckSquare,
  Star
} from 'lucide-react';

interface Protocol {
  id: string;
  title: string;
  category: 'cardiac' | 'neuro' | 'respiratory' | 'emergency' | 'pediatric' | 'general';
  description: string;
  lastUpdated: string;
  isFavorite: boolean;
  steps?: number;
}

const categoryConfig = {
  cardiac: {
    label: 'Cardiac',
    icon: Heart,
    bgClass: 'bg-destructive/10',
    textClass: 'text-destructive'
  },
  neuro: {
    label: 'Neuro',
    icon: Brain,
    bgClass: 'bg-info/10',
    textClass: 'text-info'
  },
  respiratory: {
    label: 'Respiratory',
    icon: Activity,
    bgClass: 'bg-success/10',
    textClass: 'text-success'
  },
  emergency: {
    label: 'Emergency',
    icon: Siren,
    bgClass: 'bg-warning/10',
    textClass: 'text-warning'
  },
  pediatric: {
    label: 'Pediatric',
    icon: Baby,
    bgClass: 'bg-accent/10',
    textClass: 'text-accent'
  },
  general: {
    label: 'General',
    icon: FileText,
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground'
  }
};

const ProtocolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

  const [protocols] = useState<Protocol[]>([
    {
      id: '1',
      title: 'Code Blue Response',
      category: 'emergency',
      description: 'Adult cardiac arrest response protocol with ACLS guidelines',
      lastUpdated: '2024-01-15',
      isFavorite: true,
      steps: 12
    },
    {
      id: '2',
      title: 'Sepsis Bundle (SEP-1)',
      category: 'emergency',
      description: '3-hour and 6-hour sepsis bundle requirements',
      lastUpdated: '2024-01-10',
      isFavorite: true,
      steps: 8
    },
    {
      id: '3',
      title: 'Acute Stroke Protocol',
      category: 'neuro',
      description: 'Time-sensitive stroke assessment and tPA administration',
      lastUpdated: '2024-01-08',
      isFavorite: false,
      steps: 15
    },
    {
      id: '4',
      title: 'STEMI Activation',
      category: 'cardiac',
      description: 'Door-to-balloon time optimization protocol',
      lastUpdated: '2024-01-05',
      isFavorite: false,
      steps: 10
    },
    {
      id: '5',
      title: 'Rapid Response',
      category: 'emergency',
      description: 'Early warning signs and rapid response team activation',
      lastUpdated: '2024-01-03',
      isFavorite: true,
      steps: 6
    },
    {
      id: '6',
      title: 'Ventilator Weaning',
      category: 'respiratory',
      description: 'Spontaneous breathing trial and extubation criteria',
      lastUpdated: '2024-01-02',
      isFavorite: false,
      steps: 9
    },
    {
      id: '7',
      title: 'Pediatric Fever Protocol',
      category: 'pediatric',
      description: 'Age-based fever management and workup guidelines',
      lastUpdated: '2023-12-28',
      isFavorite: false,
      steps: 7
    },
    {
      id: '8',
      title: 'Blood Transfusion',
      category: 'general',
      description: 'Safe blood product administration and reaction management',
      lastUpdated: '2023-12-20',
      isFavorite: false,
      steps: 11
    }
  ]);

  const categories = Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>;

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || protocol.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteProtocols = protocols.filter(p => p.isFavorite);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-3">
          <FileText className="w-4 h-4" />
          <span>Clinical Protocols</span>
        </div>
        <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">
          Protocol Library
        </h1>
        <p className="text-muted-foreground mt-2">
          Evidence-based clinical protocols and quick reference checklists
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories & Favorites */}
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>

          {/* Categories */}
          <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full p-3 rounded-xl text-left transition-colors flex items-center justify-between ${
                  !selectedCategory ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                }`}
              >
                <span className="font-medium">All Protocols</span>
                <Badge variant="secondary" className="rounded-full">{protocols.length}</Badge>
              </button>
              {categories.map((category) => {
                const config = categoryConfig[category];
                const count = protocols.filter(p => p.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full p-3 rounded-xl text-left transition-colors flex items-center justify-between ${
                      selectedCategory === category ? `${config.bgClass}` : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <config.icon className={`w-4 h-4 ${config.textClass}`} />
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <Badge variant="secondary" className="rounded-full">{count}</Badge>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Access Favorites */}
          <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-warning/10 to-transparent">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-warning" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {favoriteProtocols.map((protocol) => (
                <button
                  key={protocol.id}
                  onClick={() => setSelectedProtocol(protocol)}
                  className="w-full p-2 rounded-lg text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{protocol.title}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Protocol Grid */}
          {!selectedProtocol ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredProtocols.map((protocol) => {
                const config = categoryConfig[protocol.category];
                return (
                  <Card
                    key={protocol.id}
                    className="border-border/50 shadow-soft rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => setSelectedProtocol(protocol)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${config.bgClass} flex items-center justify-center`}>
                          <config.icon className={`w-5 h-5 ${config.textClass}`} />
                        </div>
                        <div className="flex items-center gap-2">
                          {protocol.isFavorite && (
                            <Star className="w-4 h-4 text-warning fill-warning" />
                          )}
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{protocol.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {protocol.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={`${config.textClass} border-current text-xs`}>
                          {config.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckSquare className="w-3 h-3" />
                          {protocol.steps} steps
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* Protocol Detail View */
            <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
              <CardHeader className={`${categoryConfig[selectedProtocol.category].bgClass}`}>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProtocol(null)}
                    className="rounded-lg"
                  >
                    ← Back to List
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg gap-2">
                    <Star className={`w-4 h-4 ${selectedProtocol.isFavorite ? 'fill-warning text-warning' : ''}`} />
                    {selectedProtocol.isFavorite ? 'Saved' : 'Save'}
                  </Button>
                </div>
                <div className="mt-4">
                  <Badge className={`${categoryConfig[selectedProtocol.category].bgClass} ${categoryConfig[selectedProtocol.category].textClass} border-0 mb-3`}>
                    {categoryConfig[selectedProtocol.category].label}
                  </Badge>
                  <CardTitle className="text-2xl">{selectedProtocol.title}</CardTitle>
                  <p className="text-muted-foreground mt-2">{selectedProtocol.description}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Protocol Meta */}
                <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Updated: {new Date(selectedProtocol.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedProtocol.steps} Steps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Evidence-Based</span>
                  </div>
                </div>

                {/* Protocol Steps Placeholder */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Protocol Steps</h4>
                  <div className="space-y-2">
                    {Array.from({ length: selectedProtocol.steps || 5 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-1/2 bg-muted/50 rounded mt-2 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Full protocol content coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clinical Tip */}
          {!selectedProtocol && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary-glow via-card to-card shadow-soft rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Protocol Tip</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Use the star icon to add frequently-used protocols to Quick Access for faster retrieval during critical situations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolsPage;
