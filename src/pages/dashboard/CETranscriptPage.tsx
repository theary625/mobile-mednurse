import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Award, 
  Download, 
  Calendar,
  FileText,
  Printer
} from 'lucide-react';
import { useUserCertificates, useTotalCECredits } from '@/hooks/useCEProgress';
import { useCECourses } from '@/hooks/useCECourses';
import { format } from 'date-fns';

const CETranscriptPage = () => {
  const navigate = useNavigate();
  const { data: certificates, isLoading } = useUserCertificates();
  const { data: courses } = useCECourses();
  const totalCredits = useTotalCECredits();

  const getCourseTitle = (courseId: string) => {
    return courses?.find(c => c.id === courseId)?.title || 'Unknown Course';
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="space-y-3">
          <div className="h-20 bg-muted rounded-xl" />
          <div className="h-20 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/ce')}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CE Courses
        </Button>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="gap-2 rounded-xl"
        >
          <Printer className="w-4 h-4" />
          Print Transcript
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary-glow via-card to-card shadow-soft rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">CE Transcript</h1>
              <p className="text-muted-foreground mt-1">
                Your complete continuing education record
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{totalCredits.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Total CE Credits</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Completed Courses ({certificates?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {certificates && certificates.length > 0 ? (
            <div className="divide-y divide-border/50">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {getCourseTitle(cert.course_id)}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{format(new Date(cert.issued_at), 'MMM d, yyyy')}</span>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                          <Award className="w-3 h-3" />
                          {cert.ce_credits_earned} Credit{cert.ce_credits_earned !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Certificate #{cert.certificate_number}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg gap-1.5 print:hidden"
                      onClick={() => navigate(`/dashboard/ce/course/${cert.course_id}`)}
                    >
                      <Download className="w-3.5 h-3.5" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No Certificates Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete CE courses to earn certificates and track your credits here.
              </p>
              <Button onClick={() => navigate('/dashboard/ce')} className="rounded-xl">
                Browse CE Courses
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Print-only Footer */}
      <div className="hidden print:block text-center text-sm text-muted-foreground pt-8 border-t">
        <p>MedNurse CE Transcript • Generated {format(new Date(), 'MMMM d, yyyy')}</p>
        <p className="mt-1">Verify certificates at mednurse.lovable.app/verify</p>
      </div>

      {/* Info Card */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden print:hidden">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-info-glow flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-info" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">About Your Transcript</h4>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              This transcript shows all CE courses you've completed through MedNurse. 
              Each certificate includes a unique verification number. Print or save this 
              transcript for your records or to submit to your state board.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CETranscriptPage;
