import React from 'react';
import { StudentPersonaMode, UserProfile, AnalysisResult, ArchitectureGuideResult, PreSubmissionAuditResult, SonarQualityResult, JavaFile, ImprovementProposal, SavedSession, PageType } from '../data/types';
import { HomePage } from '../pages/HomePage'; 
import { DocumentationPage } from '../pages/DocumentationPage';
import { ContactPage } from '../pages/contactPage/ContactPage';
import { DesdeCeroPage } from '../pages/modalidades/DesdeCeroPage'; // Mantener si la carpeta es 'modalidades'
import { AntesDeEntregarPage } from '../pages/modalidades/AntesDeEntregarPage'; // Mantener si la carpeta es 'modalidades'
import { CorregirConFeedbackPage } from '../pages/modalidades/CorregirConFeedbackPage'; // Mantener si la carpeta es 'modalidades'
import { BuenasPracticasPage } from '../pages/modalidades/BuenasPracticasPage'; // Mantener si la carpeta es 'modalidades'
import { ExploreModesPage } from '../pages/ExploreModesPage';
import { AnalysisDashboard } from './analysisDashboard/AnalysisDashboard';
import { ArchitectureGuideView } from './architectureGuide/ArchitectureGuideView';
import { PreSubmissionAuditView } from './preSubmision/PreSubmissionAuditView';
import { SonarQualityView } from './sonar/SonarQualityView';
import { PageContainer } from './layout/PageContainer';
import { PrivacyPage } from '../pages/PrivacyPage'; // Import PrivacyPage
import { TermsPage } from '../pages/TermsPage'; // Import TermsPage
import { LoadingOverlay } from './common/LoadingOverlay'; // Import the new LoadingOverlay
import { ModeDetailBuenasPracticasPage } from '../pages/mode-detail/ModeDetailBuenasPracticasPage';
import { ModeDetailAntesDeEntregarPage } from '../pages/mode-detail/ModeDetailAntesDeEntregarPage';
import { ModeDetailDesdeCeroPage } from '../pages/mode-detail/ModeDetailDesdeCeroPage';
import { ModeDetailCorregirFeedbackPage } from '../pages/mode-detail/ModeDetailCorregirFeedbackPage'; // Keep this import

interface PageRendererProps {
  currentPage: PageType;
  isAnalyzing: boolean;
  hasAnyResults: boolean;
  analysisResult: AnalysisResult | null;
  architectureGuide: ArchitectureGuideResult | null;
  preSubmissionAudit: PreSubmissionAuditResult | null;
  sonarQuality: SonarQualityResult | null;
  noFiles: JavaFile[];
  fixedFiles: JavaFile[];
  teacherDoc: string;
  proposedFiles: JavaFile[];
  activeMode: StudentPersonaMode;
  driveConnected: boolean;

  // Functions
  handleReset: () => void;
  handleApplyProposal: (proposal: ImprovementProposal) => void;
  handleSaveCurrentSession: () => void;
  setTutorModalQuery: (query: string | null) => void;
  handleSelectMode: (mode: StudentPersonaMode) => void;
  handleStartAnalysis: (noFiles: JavaFile[], fixedFiles: JavaFile[], teacherDoc: string, modeSpecificOptions: any) => void;
  handleConnectDrive: () => void;
  setIsDriveModalOpen: (isOpen: boolean) => void;
  handleLoadSample: () => void;
  navigateTo: (page: PageType) => void;
  navigateToApp: (mode: StudentPersonaMode) => void;
  goBack: () => void;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  userProfile: UserProfile | null;
  setIsProfileModalOpen: (isOpen: boolean) => void;
  handleLoadSavedSession: (session: SavedSession) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = (props) => {
  const {
    currentPage,
    isAnalyzing,
    hasAnyResults,
    analysisResult,
    architectureGuide,
    preSubmissionAudit,
    sonarQuality,
    noFiles,
    fixedFiles,
    teacherDoc,
    proposedFiles,
    activeMode,
    driveConnected,
    handleReset,
    handleApplyProposal,
    handleSaveCurrentSession,
    setTutorModalQuery,
    handleSelectMode,
    handleStartAnalysis,
    handleConnectDrive,
    setIsDriveModalOpen,
    handleLoadSample,
    navigateTo,
    navigateToApp,
    goBack,
    setIsAuthModalOpen,
    userProfile,
    setIsProfileModalOpen,
    handleLoadSavedSession,
  } = props;

  // If analyzing, show loader regardless of page
  if (isAnalyzing) {
    return (
      <LoadingOverlay activeMode={activeMode} /> // Use the new LoadingOverlay component
    );
  }

  // If we have results, show the analysis view (regardless of currentPage)
  if (hasAnyResults) {
    if (analysisResult) {
      return <AnalysisDashboard analysis={analysisResult} noFiles={noFiles} fixedFiles={fixedFiles} teacherDoc={teacherDoc} onReset={handleReset} onApplyProposal={handleApplyProposal} proposedFiles={proposedFiles} />;
    }
    if (architectureGuide) {
      return <ArchitectureGuideView guide={architectureGuide} onReset={handleReset} onSaveSession={handleSaveCurrentSession} onOpenTutor={(query) => setTutorModalQuery(query)} />;
    }
    if (preSubmissionAudit) {
      return <PreSubmissionAuditView audit={preSubmissionAudit} onReset={handleReset} onSaveSession={handleSaveCurrentSession} onOpenTutor={(query) => setTutorModalQuery(query)} />;
    }
    if (sonarQuality) {
      return <SonarQualityView sonar={sonarQuality} onReset={handleReset} onSaveSession={handleSaveCurrentSession} onOpenTutor={(query) => setTutorModalQuery(query)} />;
    }
  }

  // Page-based rendering (no active analysis, using a map for scalability)
  const pageComponents: Record<PageType, React.ReactNode> = {
    home: (
      <HomePage
          userProfile={userProfile}
          onLoadSample={handleLoadSample}
          onNavigateTo={navigateTo}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenTutorWithQuery={setTutorModalQuery}
          activeMode={activeMode}
          onSelectMode={handleSelectMode}
          onStartAnalysis={handleStartAnalysis}
          onOpenDriveModal={() => setIsDriveModalOpen(true)}
          isAnalyzing={isAnalyzing}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          driveConnected={driveConnected}
          onConnectDrive={handleConnectDrive}
          onLoadSession={handleLoadSavedSession}
        />
    ),
    campus: (
      <HomePage // HomePage will render Campus if userProfile exists
          userProfile={userProfile}
          activeMode={activeMode}
          onSelectMode={handleSelectMode}
          onOpenDriveModal={() => setIsDriveModalOpen(true)}
          onLoadSample={handleLoadSample}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          driveConnected={driveConnected}
          onConnectDrive={handleConnectDrive}
          onOpenTutorWithQuery={setTutorModalQuery}
          onStartAnalysis={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
          onLoadSession={handleLoadSavedSession} 
          onNavigateTo={navigateTo} // Pass navigateTo to HomePage
        />
    ),
    'app-desde-cero': <DesdeCeroPage onBack={goBack} onStartAnalysis={(files, modeSpecificOptions) => handleStartAnalysis(files, [], '', modeSpecificOptions)} isAnalyzing={isAnalyzing} />,
    'app-antes-de-entregar': <AntesDeEntregarPage onBack={goBack} onStartAnalysis={(files, modeSpecificOptions) => handleStartAnalysis(files, [], '', modeSpecificOptions)} isAnalyzing={isAnalyzing} />,
    'app-corregir-feedback': <CorregirConFeedbackPage onBack={goBack} onStartAnalysis={(files, modeSpecificOptions) => handleStartAnalysis(files, [], '', modeSpecificOptions)} isAnalyzing={isAnalyzing} />,
    'app-buenas-practicas': <BuenasPracticasPage onBack={goBack} onStartAnalysis={(files, modeSpecificOptions) => handleStartAnalysis(files, [], '', modeSpecificOptions)} isAnalyzing={isAnalyzing} />,
    documentation: <DocumentationPage />,
    'mode-detail-buenas-practicas': <ModeDetailBuenasPracticasPage onGoBack={() => navigateTo('explore-modes')} onStartApp={() => navigateToApp('SONAR_QUALITY')} />,
    'mode-detail-antes-de-entregar': <ModeDetailAntesDeEntregarPage onGoBack={() => navigateTo('explore-modes')} onStartApp={() => navigateToApp('PRE_SUBMISSION_AUDIT')} />,
    'mode-detail-desde-cero': <ModeDetailDesdeCeroPage onGoBack={() => navigateTo('explore-modes')} onStartApp={() => navigateToApp('ARCHITECTURE_NOOB')} />,
    'mode-detail-corregir-feedback': <ModeDetailCorregirFeedbackPage onGoBack={() => navigateTo('explore-modes')} onStartApp={() => navigateToApp('FEEDBACK_REVISION')} />,
    privacy: <PrivacyPage />,
    terms: <TermsPage />,
    contact: <ContactPage />,
    'explore-modes': (
      <ExploreModesPage navigateToApp={navigateToApp} goBack={goBack} />
    ),
  }; // Removed navigateToApp and goBack from here as they are now passed directly to ExploreModesPage

  const CurrentPageComponent = pageComponents[currentPage];

  if (CurrentPageComponent) {
    return <PageContainer>{CurrentPageComponent}</PageContainer>;
  }

  // Fallback for unknown pages
  return (
    <PageContainer>
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Página no encontrada</h1>
        <button type="button" onClick={() => navigateTo('home')} className="text-blue-600 hover:underline">
          Volver a inicio
        </button>
      </div>
    </PageContainer>
  );
};