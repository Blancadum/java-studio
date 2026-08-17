import React from 'react';
import { PageContainer } from './layout/PageContainer';

import { useNavigationContext } from '../hooks/NavigationContext'; // Import useNavigationContext
// Import all pages and views
import { ExploreModesPage } from '../pages/ExploreModesPage'; 
import { ComponentProps } from 'react'; // Import ComponentProps to infer component props
import { AntesDeEntregarPage } from '../pages/modalidades/AntesDeEntregarPage';
import { CorregirConFeedbackPage } from '../pages/modalidades/CorregirConFeedbackPage';
import { BuenasPracticasPage } from '../pages/modalidades/BuenasPracticasPage';
import { HomePage } from '../pages/HomePage'; // Import HomePage
import { AnalysisDashboard } from './analysisDashboard/AnalysisDashboard';
import { ArchitectureGuideView } from './architectureGuide/ArchitectureGuideView';
import { PreSubmissionAuditView } from './preSubmision/PreSubmissionAuditView';
import { SonarQualityView } from './sonar/SonarQualityView';

// Types
import {
  AnalysisResult,
  JavaFile,
  StudentPersonaMode,
  ArchitectureGuideResult,
  PreSubmissionAuditResult,
  SonarQualityResult,
  ImprovementProposal,
  UserProfile,
} from '../data/types';
import { DesdeCeroPage } from '../pages/modalidades/DesdeCeroPage';

export interface PageRouterProps {
  // Analysis & Results
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  architectureGuide: ArchitectureGuideResult | null;
  preSubmissionAudit: PreSubmissionAuditResult | null;
  sonarQuality: SonarQualityResult | null;

  // Files & Mode
  noFiles: JavaFile[];
  fixedFiles: JavaFile[];
  teacherDoc: string;
  activeMode: StudentPersonaMode;
  proposedFiles: JavaFile[];

  // Navigation & UI State
  currentModalitySlug: string | null;
  showModalitiesPage: boolean;

  // Handlers
  onSelectMode: (mode: StudentPersonaMode) => void;
  onStartAnalysis: (
    inputNo: JavaFile[],
    inputFixed: JavaFile[],
    inputTeacher: string,
    modeSpecificOptions?: any
  ) => Promise<void>;
  onReset: () => void;
  onApplyProposal: (proposal: ImprovementProposal) => void;
  onSaveCurrentSession: () => void;
  onOpenTutor: (query: string) => void;
  onBackFromModality: () => void;
  onOpenDriveModal: () => void;
  onLoadSample: () => void;
  onOpenAuth: () => void;
  driveConnected: boolean;
  userProfile: UserProfile | null;
}

/**
 * PageRouter - Centralizado renderizador de páginas/vistas
 * 
 * Fases de renderización:
 * 1. LOADING: Mientras isAnalyzing
 * 2. RESULTS: Si hay resultados de análisis
 * 3. MODALITY: Si hay una modalidad activa
 * 4. PAGES: Rutas normales (home, docs, etc.)
 */
export const PageRouter: React.FC<PageRouterProps> = ({
  // Analysis & Results
  isAnalyzing,
  analysisResult,
  architectureGuide,
  preSubmissionAudit,
  sonarQuality,

  // Files & Mode
  noFiles,
  fixedFiles,
  teacherDoc,
  activeMode,
  proposedFiles,

  // Navigation & UI State
  currentModalitySlug,
  showModalitiesPage,

  // Handlers
  onSelectMode,
  onStartAnalysis,
  onReset,
  onApplyProposal,
  onSaveCurrentSession,
  onOpenTutor,
  onBackFromModality,
  onOpenDriveModal,
  onLoadSample,
  onOpenAuth,
  driveConnected,
  userProfile,
}) => {
  const hasAnyResults = analysisResult || architectureGuide || preSubmissionAudit || sonarQuality;

  // ============ PHASE 1: LOADING STATE ============
  if (isAnalyzing) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Analizando tu código con {activeMode}...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // ============ PHASE 2: RESULTS STATE ============
  if (hasAnyResults) {
    if (analysisResult) {
      return (
        <PageContainer>
          <AnalysisDashboard
            onReset={onReset}
            analysis={analysisResult!} // analysisResult is guaranteed to be non-null here
            noFiles={noFiles}
            fixedFiles={fixedFiles}
            teacherDoc={teacherDoc}
            onApplyProposal={onApplyProposal}
            proposedFiles={proposedFiles}
          />
        </PageContainer>
      );
    }

    if (architectureGuide) {
      return (
        <PageContainer>
          <ArchitectureGuideView
            guide={architectureGuide}
            onReset={onReset}
            onSaveSession={onSaveCurrentSession}
          />
        </PageContainer>
      );
    }

    if (preSubmissionAudit) {
      return (
        <PageContainer>
          <PreSubmissionAuditView
            audit={preSubmissionAudit}
            onReset={onReset}
            onSaveSession={onSaveCurrentSession}
          />
        </PageContainer>
      );
    }

    if (sonarQuality) {
      return (
        <PageContainer>
          <SonarQualityView
            sonar={sonarQuality}
            onReset={onReset}
            onSaveSession={onSaveCurrentSession}
          />
        </PageContainer>
      );
    }
  }

  // ============ PHASE 3: MODALITY STATE ============
  if (currentModalitySlug) {
    const ModalityComponent = {
      'desde-cero': DesdeCeroPage,
      'antes-de-entregar': AntesDeEntregarPage,
      'corregir-feedback': CorregirConFeedbackPage,
      'buenas-practicas': BuenasPracticasPage,
    }[currentModalitySlug];

    if (ModalityComponent) {
      // Define a common adapter for onStartAnalysis for all modality pages.
      // All modality pages are assumed to expect a signature like
      // (files: JavaFile[], refinementValues: { fixedFiles: JavaFile[], teacherDoc: string }) => Promise<void>
      // This adapter translates the 2-argument call from the modality page
      // into the 4-argument call expected by the main onStartAnalysis prop.
      const adaptedOnStartAnalysis = async (
        files: JavaFile[],
        refinementValues: { fixedFiles: JavaFile[], teacherDoc: string }
      ) => {
        await onStartAnalysis(files, refinementValues.fixedFiles, refinementValues.teacherDoc, {});
      };

      return (
        <PageContainer>
          <ModalityComponent
            onBack={onBackFromModality}
            // Pass the adapted function, ensuring type compatibility for all modality pages.
            onStartAnalysis={adaptedOnStartAnalysis}
            isAnalyzing={isAnalyzing}
          />
        </PageContainer>
      );
    }
  }

  // ============ PHASE 4: PAGE ROUTES ============
  const { navigateToApp, goBack } = useNavigationContext(); // Get navigation functions from context

  if (showModalitiesPage) {
    return (
      <PageContainer>
        <ExploreModesPage
          navigateToApp={navigateToApp} // Pass navigateToApp
          goBack={goBack} // Pass goBack
          // No need to pass onSelectMode or onStartAnalysis directly to ExploreModesPage
          // as it now uses navigateToApp for mode selection.
        />
      </PageContainer>
    );
  }

  // Default: Home page
  return (
    <PageContainer>
      <HomePage
        userProfile={userProfile}
        onLoadSample={onLoadSample}
        onOpenDriveModal={onOpenDriveModal}
        onOpenAuth={onOpenAuth}
        activeMode={activeMode}
        onSelectMode={onSelectMode}
        driveConnected={driveConnected}
        onStartAnalysis={onStartAnalysis}
        isAnalyzing={isAnalyzing}
      />
    </PageContainer>
  );
};
