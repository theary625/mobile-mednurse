import { Card, CardContent } from '@/components/ui/card';
import { Route, Pill, ChevronRight } from 'lucide-react';
import { Medication } from '@/types/clinical';
import { Badge } from '@/components/ui/badge';

interface AlternativeRoutesCardProps {
  currentMedication: Medication;
  allMedications: Medication[];
  onSelectMedication: (medication: Medication) => void;
}

const AlternativeRoutesCard = ({ 
  currentMedication, 
  allMedications, 
  onSelectMedication 
}: AlternativeRoutesCardProps) => {
  // Find medications with the same generic name but different routes
  const alternativeMeds = allMedications.filter(med => {
    // Same generic name (case insensitive)
    const sameGenericName = med.generic_name.toLowerCase() === currentMedication.generic_name.toLowerCase();
    // Different medication (different ID)
    const differentMed = med.id !== currentMedication.id;
    // Has a different route
    const currentRoutes = currentMedication.route || [];
    const medRoutes = med.route || [];
    const hasDifferentRoute = !currentRoutes.some(r => medRoutes.includes(r)) || 
                              medRoutes.some(r => !currentRoutes.includes(r));
    
    return sameGenericName && differentMed && hasDifferentRoute;
  });

  // Don't render if no alternative routes available
  if (alternativeMeds.length === 0) {
    return null;
  }

  const getRouteColor = (route: string) => {
    const routeUpper = route.toUpperCase();
    if (routeUpper === 'IV' || routeUpper === 'INTRAVENOUS') {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    }
    if (routeUpper === 'IM' || routeUpper === 'INTRAMUSCULAR') {
      return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
    }
    if (routeUpper === 'SC' || routeUpper === 'SUBQ' || routeUpper === 'SUBCUTANEOUS') {
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    }
    if (routeUpper === 'PO' || routeUpper === 'ORAL') {
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
    }
    if (routeUpper === 'PR' || routeUpper === 'RECTAL') {
      return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
    }
    if (routeUpper === 'SL' || routeUpper === 'SUBLINGUAL') {
      return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300';
    }
    if (routeUpper === 'TOPICAL') {
      return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
    }
    if (routeUpper === 'INHALED' || routeUpper === 'INH') {
      return 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300';
    }
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="mb-6 border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent rounded-2xl overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Route className="w-4 h-4 text-secondary-foreground" />
          <span className="text-sm font-semibold text-secondary-foreground">Also Available In</span>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {alternativeMeds.length} route{alternativeMeds.length > 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {alternativeMeds.map((med) => (
            <button
              key={med.id}
              onClick={() => onSelectMedication(med)}
              className="flex items-center gap-3 p-3 bg-background/60 hover:bg-background rounded-xl transition-all hover:shadow-sm group text-left w-full"
            >
              {/* Medication image or icon */}
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                {med.image_url ? (
                  <img src={med.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Pill className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">
                    {med.brand_names?.[0] || med.generic_name}
                  </span>
                  {med.high_alert && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                      High Alert
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {med.route?.map((route, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getRouteColor(route)}`}
                    >
                      {route}
                    </span>
                  ))}
                  {(!med.route || med.route.length === 0) && (
                    <span className="text-xs text-muted-foreground">Oral</span>
                  )}
                </div>
                {/* Available doses/strengths */}
                {med.strengths && med.strengths.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">Doses:</span>
                    {med.strengths.slice(0, 4).map((strength, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded"
                      >
                        {strength}
                      </span>
                    ))}
                    {med.strengths.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{med.strengths.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternativeRoutesCard;
