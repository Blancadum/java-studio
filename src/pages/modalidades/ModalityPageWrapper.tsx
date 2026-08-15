import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { StudentPersonaMode } from '../../data/types';
import { ModalityDashboard } from '../../components/modality/ModalityDashboard';

interface ModalityPageWrapperProps {
  mode: StudentPersonaMode;
  onBack: () => void;
  onStartAnalysis: (files: any[], refinementValues: any) => void;
  isAnalyzing: boolean;
}

export const ModalityPageWrapper: React.FC<ModalityPageWrapperProps> = ({
  mode,
  onBack,
  onStartAnalysis,
  isAnalyzing
}) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a modalidades
          </button>
        </div>
      </div>
      <ModalityDashboard
        mode={mode}
        onBack={onBack}
        onStartAnalysis={onStartAnalysis}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};
