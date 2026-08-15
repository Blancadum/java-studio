import React from 'react';
import { ModalityPageWrapper } from './ModalityPageWrapper';

interface CorregirConFeedbackPageProps {
  onBack: () => void;
  onStartAnalysis: (files: any[], refinementValues: any) => void;
  isAnalyzing: boolean;
}

export const CorregirConFeedbackPage: React.FC<CorregirConFeedbackPageProps> = ({
  onBack,
  onStartAnalysis,
  isAnalyzing
}) => {
  return (
    <ModalityPageWrapper
      mode="FEEDBACK_REVISION"
      onBack={onBack}
      onStartAnalysis={onStartAnalysis}
      isAnalyzing={isAnalyzing}
    />
  );
};
