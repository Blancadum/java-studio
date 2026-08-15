import React from 'react';
import { ModalityPageWrapper } from './ModalityPageWrapper';

interface AntesDeEntregarPageProps {
  onBack: () => void;
  onStartAnalysis: (files: any[], refinementValues: any) => void;
  isAnalyzing: boolean;
}

export const AntesDeEntregarPage: React.FC<AntesDeEntregarPageProps> = ({
  onBack,
  onStartAnalysis,
  isAnalyzing
}) => {
  return (
    <ModalityPageWrapper
      mode="PRE_SUBMISSION_AUDIT"
      onBack={onBack}
      onStartAnalysis={onStartAnalysis}
      isAnalyzing={isAnalyzing}
    />
  );
};
