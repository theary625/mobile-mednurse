import { forwardRef } from 'react';

interface MedicationLog {
  name: string;
  count: number;
  doses?: string[];
}

interface CodeSummaryData {
  type: 'ACLS' | 'PALS';
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  outcome: 'ROSC' | 'Ongoing' | 'Terminated';
  initialRhythm: string;
  finalRhythm?: string;
  shockCount: number;
  medications: MedicationLog[];
  cprCycles: number;
  reversibleCausesChecked: string[];
  checklistCompleted: string[];
  patientInfo?: {
    weight?: number;
    ageGroup?: string;
  };
  notes?: string;
}

interface CodeSummaryPrintProps {
  data: CodeSummaryData;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const CodeSummaryPrint = forwardRef<HTMLDivElement, CodeSummaryPrintProps>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white text-black p-8 print:p-4 max-w-[800px] mx-auto font-sans"
        style={{ fontSize: '12px', lineHeight: '1.4' }}
      >
        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{data.type} Code Summary</h1>
              <p className="text-sm text-gray-600">AHA 2025 Guidelines</p>
            </div>
            <div className="text-right text-sm">
              <p><strong>Generated:</strong> {formatDateTime(new Date())}</p>
              <p className="text-xs text-gray-500">MedNurse Clinical Tools</p>
            </div>
          </div>
        </div>

        {/* Patient Info (PALS) */}
        {data.patientInfo && (data.patientInfo.weight || data.patientInfo.ageGroup) && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-bold text-sm mb-2">Patient Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {data.patientInfo.weight && (
                <p><strong>Weight:</strong> {data.patientInfo.weight} kg</p>
              )}
              {data.patientInfo.ageGroup && (
                <p><strong>Age Group:</strong> {data.patientInfo.ageGroup}</p>
              )}
            </div>
          </div>
        )}

        {/* Code Timeline */}
        <div className="mb-4 p-3 border border-gray-300 rounded">
          <h3 className="font-bold text-sm mb-2 border-b pb-1">Code Timeline</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Code Start:</strong> {formatDateTime(data.startTime)}</p>
              <p><strong>Code End:</strong> {formatDateTime(data.endTime)}</p>
              <p><strong>Total Duration:</strong> {formatTime(data.totalDuration)}</p>
            </div>
            <div>
              <p><strong>Initial Rhythm:</strong> {data.initialRhythm}</p>
              {data.finalRhythm && <p><strong>Final Rhythm:</strong> {data.finalRhythm}</p>}
              <p>
                <strong>Outcome:</strong>{' '}
                <span className={data.outcome === 'ROSC' ? 'text-green-700 font-bold' : ''}>
                  {data.outcome}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Interventions Summary */}
        <div className="mb-4 p-3 border border-gray-300 rounded">
          <h3 className="font-bold text-sm mb-2 border-b pb-1">Interventions Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>CPR Cycles:</strong> {data.cprCycles}</p>
              <p><strong>Defibrillations:</strong> {data.shockCount}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Medications:</h4>
              {data.medications.length > 0 ? (
                <ul className="list-disc list-inside">
                  {data.medications.map((med, idx) => (
                    <li key={idx}>
                      {med.name}: {med.count} dose(s)
                      {med.doses && med.doses.length > 0 && (
                        <span className="text-gray-600"> ({med.doses.join(', ')})</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No medications administered</p>
              )}
            </div>
          </div>
        </div>

        {/* Reversible Causes (H's & T's) */}
        <div className="mb-4 p-3 border border-gray-300 rounded">
          <h3 className="font-bold text-sm mb-2 border-b pb-1">Reversible Causes Assessed (H's & T's)</h3>
          {data.reversibleCausesChecked.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 text-sm">
              {data.reversibleCausesChecked.map((cause, idx) => (
                <p key={idx}>✓ {cause}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No causes documented as assessed</p>
          )}
        </div>

        {/* Code Checklist */}
        <div className="mb-4 p-3 border border-gray-300 rounded">
          <h3 className="font-bold text-sm mb-2 border-b pb-1">Code Checklist Completed</h3>
          {data.checklistCompleted.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 text-sm">
              {data.checklistCompleted.map((item, idx) => (
                <p key={idx}>✓ {item}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No checklist items documented</p>
          )}
        </div>

        {/* Notes Section */}
        {data.notes && (
          <div className="mb-4 p-3 border border-gray-300 rounded">
            <h3 className="font-bold text-sm mb-2 border-b pb-1">Additional Notes</h3>
            <p className="text-sm whitespace-pre-wrap">{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-300 text-xs text-gray-500">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2"><strong>Provider Signature:</strong></p>
              <div className="border-b border-gray-400 w-48 h-8"></div>
            </div>
            <div>
              <p className="mb-2"><strong>Date/Time:</strong></p>
              <div className="border-b border-gray-400 w-48 h-8"></div>
            </div>
          </div>
          <p className="mt-4 text-center">
            This document is generated for documentation purposes. Verify all information before inclusion in medical records.
          </p>
        </div>
      </div>
    );
  }
);

CodeSummaryPrint.displayName = 'CodeSummaryPrint';

export type { CodeSummaryData, MedicationLog };
export default CodeSummaryPrint;
