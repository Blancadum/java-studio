import React from 'react';
import { ModalityPageWrapper } from './ModalityPageWrapper';

interface BuenasPracticasPageProps {
  onBack: () => void;
  onStartAnalysis: (files: any[], refinementValues: any) => void;
  isAnalyzing: boolean;
}

export const BuenasPracticasPage: React.FC<BuenasPracticasPageProps> = ({
  onBack,
  onStartAnalysis,
  isAnalyzing
}) => {
  return (
    <ModalityPageWrapper
      mode="SONAR_QUALITY"
      onBack={onBack}
      onStartAnalysis={onStartAnalysis}
      isAnalyzing={isAnalyzing}
    />
  );
};
