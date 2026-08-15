import React from 'react';
import { ModalityPageWrapper } from './ModalityPageWrapper';

interface DesdeCeroPageProps {
  onBack: () => void;
  onStartAnalysis: (files: any[], refinementValues: any) => void;
  isAnalyzing: boolean;
}

export const DesdeCeroPage: React.FC<DesdeCeroPageProps> = ({
  onBack,
  onStartAnalysis,
  isAnalyzing
}) => {
  return (
    <ModalityPageWrapper
      mode="ARCHITECTURE_NOOB"
      onBack={onBack}
      onStartAnalysis={onStartAnalysis}
      isAnalyzing={isAnalyzing}
    />
  );
};
