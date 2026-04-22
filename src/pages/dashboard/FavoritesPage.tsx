import { useState, useEffect, useRef } from 'react';
import quickTipsIcon from '@/assets/quick-tips-icon.png';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pill,
  Calculator,
  Clock,
  AlertTriangle,
  FileText,
  Star,
  StickyNote,
  Check,
  X,
  Pencil,
  Trash2
} from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FavoriteMedication {
  id: string;
  medication_name: string;
  drug_class: string | null;
  high_alert: boolean;
  note: string | null;
  imageUrl?: string | null;
}

interface FavoriteTool {
  id: string;
  toolId: string;
  name: string;
  category: string;
}

interface RecentItem {
  id: string;
  type: 'medication' | 'tool' | 'protocol';
  name: string;
  viewedAt: string;
  imageUrl?: string | null;
}

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favoriteMeds, setFavoriteMeds] = useState<FavoriteMedication[]>([]);
  const [favoriteTools] = useState<FavoriteTool[]>([
    { id: '1', toolId: 'cockcroftgault', name: 'CrCl Calculator', category: 'Renal' },
    { id: '2', toolId: 'nihss', name: 'NIHSS Score', category: 'Neuro' },
    { id: '3', toolId: 'gcs', name: 'GCS Calculator', category: 'Neuro' }
  ]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([
    { id: '1', type: 'medication', name: 'Warfarin', viewedAt: '5 min ago' },
    { id: '2', type: 'tool', name: 'A-a Gradient', viewedAt: '15 min ago' },
    { id: '3', type: 'protocol', name: 'Sepsis Bundle', viewedAt: '1 hour ago' },
    { id: '4', type: 'medication', name: 'Norepinephrine', viewedAt: '2 hours ago' },
    { id: '5', type: 'tool', name: 'Corrected Calcium', viewedAt: '3 hours ago' },
    { id: '6', type: 'medication', name: 'Propofol', viewedAt: 'Yesterday' }
  ]);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const noteInputRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(true);

  // Fetch favorite medications from database
  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('user_medication_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        setLoading(false);
        return;
      }

      // Fetch images for each medication
      const medsWithImages = await Promise.all(
        (data || []).map(async (med) => {
          const { data: searchData } = await supabase.rpc('search_medications', { search_query: med.medication_name, max_results: 1 });
          return { ...med, imageUrl: searchData?.[0]?.image_url || null } as FavoriteMedication;
        })
      );
      setFavoriteMeds(medsWithImages);
      setLoading(false);
    };
    fetchFavorites();
  }, []);

  // Fetch images for recent medication items
  useEffect(() => {
    const fetchRecentMedImages = async () => {
      const medItems = recentItems.filter(i => i.type === 'medication');
      if (medItems.length === 0) return;
      const results = await Promise.all(
        medItems.map(async (item) => {
          const { data } = await supabase.rpc('search_medications', { search_query: item.name, max_results: 1 });
          return { id: item.id, imageUrl: data?.[0]?.image_url || null };
        })
      );
      setRecentItems(prev => prev.map(item => {
        const match = results.find(r => r.id === item.id);
        return match ? { ...item, imageUrl: match.imageUrl } : item;
      }));
    };
    fetchRecentMedImages();
  }, []);

  // Focus textarea when editing
  useEffect(() => {
    if (editingNoteId && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [editingNoteId]);

  const startEditNote = (med: FavoriteMedication, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNoteId(med.id);
    setNoteText(med.note || '');
  };

  const cancelEditNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNoteId(null);
    setNoteText('');
  };

  const saveNote = async (medId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const trimmed = noteText.trim();
    const { error } = await supabase
      .from('user_medication_favorites')
      .update({ note: trimmed || null })
      .eq('id', medId);

    if (error) {
      toast.error('Failed to save note');
      return;
    }

    setFavoriteMeds(prev => prev.map(m => m.id === medId ? { ...m, note: trimmed || null } : m));
    setEditingNoteId(null);
    setNoteText('');
    toast.success('Note saved');
  };

  const removeFavorite = async (medId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase
      .from('user_medication_favorites')
      .delete()
      .eq('id', medId);

    if (error) {
      toast.error('Failed to remove favorite');
      return;
    }

    setFavoriteMeds(prev => prev.filter(m => m.id !== medId));
    toast.success('Removed from favorites');
  };

  const getTypeIcon = (type: string, imageUrl?: string | null) => {
    if (type === 'medication' && imageUrl) {
      return <img src={imageUrl} alt="" className="w-full h-full object-cover rounded" />;
    }
    switch (type) {
      case 'medication': return <Pill className="w-3.5 h-3.5 text-primary" />;
      case 'tool': return <Calculator className="w-3.5 h-3.5 text-success" />;
      case 'protocol': return <FileText className="w-3.5 h-3.5 text-accent" />;
      default: return <Star className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-3">
          <Heart className="w-4 h-4" />
          <span>Favorites</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          My Favorites
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Quick access to your saved medications, tools, and recent activity
        </p>
      </div>

      {/* Medications Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">Medications</h2>
          <Badge variant="secondary" className="rounded-full text-xs">{favoriteMeds.length}</Badge>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading favorites…</div>
        ) : favoriteMeds.length > 0 ? (
          <div className="space-y-2">
            {favoriteMeds.map((med) => (
              <div
                key={med.id}
                className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
                onClick={() => navigate(`/dashboard/meds?med=${encodeURIComponent(med.medication_name)}`)}
              >
                {/* Med image/icon */}
                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden ${
                  med.high_alert ? 'bg-destructive/10' : 'bg-primary-glow'
                }`}>
                  {med.imageUrl ? (
                    <img src={med.imageUrl} alt={med.medication_name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <Pill className={`w-4 h-4 ${med.high_alert ? 'text-destructive' : 'text-primary'}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-foreground truncate">{med.medication_name}</p>
                    {med.high_alert && (
                      <Badge className="bg-destructive/10 text-destructive border-0 text-[10px] px-1 py-0 gap-0.5 flex-shrink-0">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        HA
                      </Badge>
                    )}
                  </div>
                  {med.drug_class && (
                    <p className="text-xs text-muted-foreground truncate">{med.drug_class}</p>
                  )}

                  {/* Note display or edit */}
                  {editingNoteId === med.id ? (
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        ref={noteInputRef}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        maxLength={200}
                        placeholder="Add a personal note (e.g. dosing reminder)…"
                        className="w-full text-xs bg-muted/50 border border-border rounded-lg p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                        rows={2}
                      />
                      <div className="flex items-center gap-1 mt-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs gap-1" onClick={(e) => saveNote(med.id, e)}>
                          <Check className="w-3 h-3" /> Save
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs gap-1 text-muted-foreground" onClick={cancelEditNote}>
                          <X className="w-3 h-3" /> Cancel
                        </Button>
                        <span className="text-[10px] text-muted-foreground ml-auto">{noteText.length}/200</span>
                      </div>
                    </div>
                  ) : med.note ? (
                    <div className="mt-1.5 flex items-start gap-1.5 group/note">
                      <StickyNote className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground italic leading-relaxed flex-1">{med.note}</p>
                      <button
                        onClick={(e) => startEditNote(med, e)}
                        className="opacity-0 group-hover/note:opacity-100 transition-opacity flex-shrink-0"
                      >
                        <Pencil className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={(e) => startEditNote(med, e)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    title={med.note ? 'Edit note' : 'Add note'}
                  >
                    <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={(e) => removeFavorite(med.id, e)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-border">
            <Pill className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No favorite medications yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Tap the <Heart className="inline w-3 h-3 text-destructive -mt-0.5" /> icon on any medication to save it here
            </p>
          </div>
        )}
      </section>

      {/* Tools Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-success" />
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">Tools</h2>
          <Badge variant="secondary" className="rounded-full text-xs">{favoriteTools.length}</Badge>
        </div>

        {favoriteTools.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {favoriteTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => navigate(`/dashboard/toolbox?tool=${tool.toolId}`)}
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border/50 hover:border-success/30 hover:shadow-md transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-success" />
                </div>
                <div className="min-w-0 w-full">
                  <p className="font-semibold text-sm text-foreground truncate">{tool.name}</p>
                  <Badge variant="outline" className="text-[10px] mt-1">{tool.category}</Badge>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-border">
            <Calculator className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No favorite tools yet</p>
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">Recently Viewed</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {recentItems.map((item) => (
            <button
              key={item.id}
              className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border/50 hover:border-primary/20 transition-all flex-shrink-0"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center overflow-hidden bg-muted/50">
                {getTypeIcon(item.type, item.imageUrl)}
              </div>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">{item.name}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">· {item.viewedAt}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Pro Tip */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/8 via-primary/4 to-transparent border border-primary/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4 p-5">
          <div className="w-14 h-14 rounded-xl bg-background shadow-sm border border-border/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={quickTipsIcon} alt="" className="w-10 h-10 object-contain" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground text-sm tracking-tight">Quick Tip</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Tap the <Heart className="inline w-3 h-3 text-destructive -mt-0.5" /> icon on any medication to save it here. Hover over a saved med and tap the <StickyNote className="inline w-3 h-3 text-amber-500 -mt-0.5" /> icon to add a personal note.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
