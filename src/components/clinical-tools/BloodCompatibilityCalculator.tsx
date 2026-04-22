import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Droplets, Info } from 'lucide-react';

type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// RBC compatibility: Can donor give RBCs to recipient?
const rbcCompatibility: Record<BloodType, BloodType[]> = {
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal donor
  'O+': ['A+', 'B+', 'AB+', 'O+'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'A+': ['A+', 'AB+'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB+', 'AB-'],
  'AB+': ['AB+'], // Universal recipient
};

// Plasma compatibility: Can donor give plasma to recipient? (opposite of RBC)
const plasmaCompatibility: Record<BloodType, BloodType[]> = {
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal plasma donor
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'A+': ['A+', 'O+'],
  'A-': ['A+', 'A-', 'O+', 'O-'],
  'B+': ['B+', 'O+'],
  'B-': ['B+', 'B-', 'O+', 'O-'],
  'O+': ['O+'],
  'O-': ['O+', 'O-'],
};

const BloodCompatibilityCalculator = () => {
  const [donorType, setDonorType] = useState<BloodType | ''>('');
  const [recipientType, setRecipientType] = useState<BloodType | ''>('');

  const checkRBCCompatibility = (): boolean | null => {
    if (!donorType || !recipientType) return null;
    return rbcCompatibility[donorType].includes(recipientType);
  };

  const checkPlasmaCompatibility = (): boolean | null => {
    if (!donorType || !recipientType) return null;
    return plasmaCompatibility[donorType].includes(recipientType);
  };

  const rbcResult = checkRBCCompatibility();
  const plasmaResult = checkPlasmaCompatibility();

  const getCompatibleDonors = (recipient: BloodType): BloodType[] => {
    return bloodTypes.filter(donor => rbcCompatibility[donor].includes(recipient));
  };

  const getCompatibleRecipients = (donor: BloodType): BloodType[] => {
    return rbcCompatibility[donor];
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-red-500/10 via-red-400/5 to-transparent pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <CardTitle className="text-xl">Blood Compatibility Chart</CardTitle>
            <CardDescription>Check RBC and plasma transfusion compatibility</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Input Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Donor Blood Type</Label>
            <Select value={donorType} onValueChange={(v) => setDonorType(v as BloodType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select donor type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    <span className="font-semibold">{type}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recipient Blood Type</Label>
            <Select value={recipientType} onValueChange={(v) => setRecipientType(v as BloodType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    <span className="font-semibold">{type}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Compatibility Results */}
        {donorType && recipientType && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Compatibility Results
              <Badge variant="outline" className="ml-2">
                {donorType} → {recipientType}
              </Badge>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* RBC Compatibility */}
              <Alert className={rbcResult ? 'border-green-500/50 bg-green-500/10' : 'border-destructive/50 bg-destructive/10'}>
                {rbcResult ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <AlertTitle className={rbcResult ? 'text-green-700 dark:text-green-400' : 'text-destructive'}>
                  RBC Transfusion
                </AlertTitle>
                <AlertDescription className={rbcResult ? 'text-green-600 dark:text-green-300' : 'text-destructive/80'}>
                  {rbcResult 
                    ? `Compatible - ${donorType} RBCs can be given to ${recipientType} recipient`
                    : `Incompatible - ${donorType} RBCs CANNOT be given to ${recipientType} recipient`
                  }
                </AlertDescription>
              </Alert>

              {/* Plasma Compatibility */}
              <Alert className={plasmaResult ? 'border-green-500/50 bg-green-500/10' : 'border-destructive/50 bg-destructive/10'}>
                {plasmaResult ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                <AlertTitle className={plasmaResult ? 'text-green-700 dark:text-green-400' : 'text-destructive'}>
                  Plasma Transfusion
                </AlertTitle>
                <AlertDescription className={plasmaResult ? 'text-green-600 dark:text-green-300' : 'text-destructive/80'}>
                  {plasmaResult 
                    ? `Compatible - ${donorType} plasma can be given to ${recipientType} recipient`
                    : `Incompatible - ${donorType} plasma CANNOT be given to ${recipientType} recipient`
                  }
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {/* Quick Reference for Selected Recipient */}
        {recipientType && (
          <div className="p-4 bg-muted/30 rounded-xl space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Compatible RBC Donors for {recipientType}
            </h4>
            <div className="flex flex-wrap gap-2">
              {getCompatibleDonors(recipientType).map((type) => (
                <Badge 
                  key={type} 
                  variant={type === donorType ? "default" : "secondary"}
                  className="text-sm"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Reference for Selected Donor */}
        {donorType && (
          <div className="p-4 bg-muted/30 rounded-xl space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              {donorType} Can Donate RBCs To
            </h4>
            <div className="flex flex-wrap gap-2">
              {getCompatibleRecipients(donorType).map((type) => (
                <Badge 
                  key={type} 
                  variant={type === recipientType ? "default" : "secondary"}
                  className="text-sm"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Notes */}
        <Alert className="border-warning/50 bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-warning">Clinical Reminder</AlertTitle>
          <AlertDescription className="text-warning/80 text-sm space-y-1">
            <p>• Always verify with blood bank and follow institutional crossmatch protocols</p>
            <p>• O- is the universal RBC donor; AB+ is the universal RBC recipient</p>
            <p>• AB is the universal plasma donor; O is the universal plasma recipient</p>
            <p>• Consider CMV status, irradiation needs, and special requirements for immunocompromised patients</p>
          </AlertDescription>
        </Alert>

        {/* Full Compatibility Chart */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">RBC Compatibility Quick Reference</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border border-border p-2 bg-muted/50 text-left">Donor ↓ / Recipient →</th>
                  {bloodTypes.map((type) => (
                    <th key={type} className="border border-border p-2 bg-muted/50 text-center font-semibold">
                      {type}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bloodTypes.map((donor) => (
                  <tr key={donor}>
                    <td className="border border-border p-2 font-semibold bg-muted/30">{donor}</td>
                    {bloodTypes.map((recipient) => {
                      const isCompatible = rbcCompatibility[donor].includes(recipient);
                      const isSelected = donor === donorType && recipient === recipientType;
                      return (
                        <td 
                          key={recipient} 
                          className={`border border-border p-2 text-center ${
                            isSelected ? 'ring-2 ring-primary' : ''
                          } ${isCompatible ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive/60'}`}
                        >
                          {isCompatible ? '✓' : '✗'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodCompatibilityCalculator;
