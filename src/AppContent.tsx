import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navbar/Navbar';
import { AnalysisDashboard } from './components/analysisDashboard/AnalysisDashboard';
import { DrivePickerModal } from './components/drivePicker/DrivePickerModal';
import { AuthModal } from './components/authModal/AuthModal';
import { ArchitectureGuideView } from './components/architectureGuide/ArchitectureGuideView';
import { PreSubmissionAuditView } from './components/preSubmision/PreSubmissionAuditView';
import { SonarQualityView } from './components/sonar/SonarQualityView';
import { JavaTutorChat } from './components/javaTutor/JavaTutorChat'; 
import { JavaBotOnboardingWidget } from './components/javaBot/JavaBotOnboardingWidget';
import { HomePage } from './pages/HomePage';
import { ExploreModesPage } from './pages/ExploreModesPage'; // Correct import for the modes selection page
import { DesdeCeroPage } from './pages/modalidades/DesdeCeroPage';
import { AntesDeEntregarPage } from './pages/modalidades/AntesDeEntregarPage';
import { CorregirConFeedbackPage } from './pages/modalidades/CorregirConFeedbackPage';
import { BuenasPracticasPage } from './pages/modalidades/BuenasPracticasPage';
import { useWorkspace } from './components/home/WorkspaceContext';

import { UserProfileModal } from './components/userProfile/UserProfileModal';
import { AnalysisResult, JavaFile, ImprovementProposal, StudentPersonaMode, UserProfile, SavedSession, ArchitectureGuideResult, PreSubmissionAuditResult, SonarQualityResult } from './data/types';
import { INITIAL_SAMPLE_ANALYSIS, SAMPLE_NO_FILES, SAMPLE_FIXED_FILES, SAMPLE_TEACHER_DOC } from './data/sampleProject';
import { Loader2 } from 'lucide-react';

export function AppContent() {
  // Drive & OAuth State
  const [driveConnected, setDriveConnected] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState<boolean>(false);

  // User Auth & Modals
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [showModalitiesPage, setShowModalitiesPage] = useState<boolean>(false);
  const [currentModalitySlug, setCurrentModalitySlug] = useState<string | null>(null);

  // Active Student Persona Mode
  const [activeMode, setActiveMode] = useState<StudentPersonaMode>('FEEDBACK_REVISION');

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [architectureGuide, setArchitectureGuide] = useState<ArchitectureGuideResult | null>(null);
  const [preSubmissionAudit, setPreSubmissionAudit] = useState<PreSubmissionAuditResult | null>(null);
  const [sonarQuality, setSonarQuality] = useState<SonarQualityResult | null>(null);
  const [tutorModalQuery, setTutorModalQuery] = useState<string | null>(null);

  // Project Files from context
  const { noFiles, setNoFiles, fixedFiles, setFixedFiles, teacherDoc, setTeacherDoc } = useWorkspace();
  const [proposedFiles, setProposedFiles] = useState<JavaFile[]>([]);

  // Listen for OAuth postMessage
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        const tokens = event.data.tokens;
        if (tokens?.access_token) {
          setAccessToken(tokens.access_token);
          setDriveConnected(true);

          // Fetch user info
          try {
            const res = await fetch('/api/auth/user', {
              headers: { Authorization: `Bearer ${tokens.access_token}` }
            });
            const userData = await res.json();
            if (userData.email) {
              setUserEmail(userData.email);
            }
          } catch (err) {
            console.error('Error fetching user info:', err);
          }

          // Open Drive modal automatically
          setIsDriveModalOpen(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectDrive = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();
      if (data.authUrl) {
        window.open(data.authUrl, 'GoogleAuth', 'width=600,height=700');
      } else {
        alert(data.error || 'No se pudo obtener la URL de OAuth. Verifica las claves OAUTH_CLIENT_ID y OAUTH_CLIENT_SECRET.');
      }
    } catch (err: any) {
      console.error('Failed to initiate OAuth:', err);
      alert('Error al conectar con Google: ' + err.message);
    }
  };

  const handleLoadSample = () => {
    setActiveMode('FEEDBACK_REVISION');
    setNoFiles(SAMPLE_NO_FILES);
    setFixedFiles(SAMPLE_FIXED_FILES);
    setTeacherDoc(SAMPLE_TEACHER_DOC);
    setAnalysisResult(INITIAL_SAMPLE_ANALYSIS);

    const initialProposed = SAMPLE_FIXED_FILES.map(f => ({
      ...f,
      version: 'PROPOSED' as const
    }));

    initialProposed.push({
      id: 'prop-reserva-ex',
      name: 'ReservaNotFoundException.java',
      path: 'com/universidad/excepcion/ReservaNotFoundException.java',
      version: 'PROPOSED',
      content: `package com.universidad.excepcion;

public class ReservaNotFoundException extends Exception {
    public ReservaNotFoundException(String mensaje) {
        super(mensaje);
    }
}`
    });

    setProposedFiles(initialProposed);
  };

  const handleSelectMode = (mode: StudentPersonaMode) => {
    setActiveMode(mode);
    // Reset results when mode changes
    setAnalysisResult(null);
    setArchitectureGuide(null);
    setPreSubmissionAudit(null);
    setSonarQuality(null);
  };

  const handleStartAnalysis = async (
    inputNo: JavaFile[],
    inputFixed: JavaFile[],
    inputTeacher: string,
    modeSpecificOptions: any = {}
  ) => {
    setNoFiles(inputNo);
    setFixedFiles(inputFixed);
    setTeacherDoc(inputTeacher);
    setIsAnalyzing(true);

    // Prepare API Options if user has custom config
    const apiOptions = userProfile ? {
      preferredProvider: userProfile.apiConfig.preferredProvider,
      geminiUserKey: userProfile.apiConfig.geminiUserKey,
      backupUserKey: userProfile.apiConfig.backupUserKey,
      fallbackEnabled: userProfile.apiConfig.fallbackEnabled
    } : {};

    try {
      if (activeMode === 'FEEDBACK_REVISION') {
        const res = await fetch('/api/analyze/java-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            noFiles: inputNo,
            fixedFiles: inputFixed,
            teacherDoc: inputTeacher,
            apiOptions
          })
        });
        const data = await res.json();
        if (res.ok) {
          setAnalysisResult(data);
          setProposedFiles(inputFixed.map(f => ({ ...f, version: 'PROPOSED' as const })));
        } else {
          alert('Error en evaluación: ' + (data.error || 'Respuesta fallida de Gemini'));
        }
      } else if (activeMode === 'ARCHITECTURE_NOOB') {
        const res = await fetch('/api/analyze/noob-architecture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            statementText: modeSpecificOptions.statementText || inputTeacher || 'Enunciado de práctica de Java II',
            includeInterfaces: modeSpecificOptions.includeInterfaces,
            useLombok: modeSpecificOptions.useLombok,
            generateTodoComments: modeSpecificOptions.generateTodoComments,
            javaVersion: modeSpecificOptions.javaVersion,
            apiOptions
          })
        });
        const data = await res.json();
        if (res.ok) setArchitectureGuide(data);
        else alert('Error en arquitectura: ' + (data.error || 'Fallo de IA'));
      } else if (activeMode === 'PRE_SUBMISSION_AUDIT') {
        const res = await fetch('/api/analyze/pre-submission-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: [...inputNo, ...inputFixed],
            teacherRubricText: inputTeacher,
            purgeFolders: modeSpecificOptions.purgeFolders,
            sanitizeAiComments: modeSpecificOptions.sanitizeAiComments,
            checkRubric: modeSpecificOptions.checkRubric,
            apiOptions
          })
        });
        const data = await res.json();
        if (res.ok) setPreSubmissionAudit(data);
        else alert('Error en auditoría pre-entrega: ' + (data.error || 'Fallo de IA'));
      } else if (activeMode === 'SONAR_QUALITY') {
        const res = await fetch('/api/analyze/sonar-quality', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: [...inputNo, ...inputFixed],
            evalS3776: modeSpecificOptions.evalS3776,
            evalStringConcat: modeSpecificOptions.evalStringConcat,
            generateJunit5: modeSpecificOptions.generateJunit5,
            apiOptions
          })
        });
        const data = await res.json();
        if (res.ok) setSonarQuality(data);
        else alert('Error en auditoría SonarQube: ' + (data.error || 'Fallo de IA'));
      }
    } catch (err: any) {
      alert('Error de conexión al analizar: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyProposal = async (proposal: ImprovementProposal) => {
    const existingIndex = proposedFiles.findIndex(
      f => f.path === proposal.fileTarget || f.name === proposal.fileTarget.split('/').pop()
    );

    if (existingIndex >= 0) {
      const fileToUpdate = proposedFiles[existingIndex];
      try {
        const res = await fetch('/api/generate/improved-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileTarget: fileToUpdate.name,
            currentCode: fileToUpdate.content,
            proposalsToApply: [proposal],
            teacherDoc
          })
        });
        const data = await res.json();
        const newCode = data.updatedCode || proposal.proposedCode;

        setProposedFiles(prev => {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            content: newCode
          };
          return updated;
        });
      } catch (err) {
        console.error('Error improving file:', err);
        setProposedFiles(prev => {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            content: proposal.proposedCode
          };
          return updated;
        });
      }
    } else {
      setProposedFiles(prev => [
        ...prev,
        {
          id: proposal.id,
          name: proposal.fileTarget.split('/').pop() || proposal.fileTarget,
          path: proposal.fileTarget,
          content: proposal.proposedCode,
          version: 'PROPOSED'
        }
      ]);
    }
  };

  const handleSaveCurrentSession = async () => {
    if (!userProfile) {
      setIsAuthModalOpen(true);
      return;
    }

    let title = 'Análisis de Proyecto Java II';
    let score = 85;
    let payloadData: any = {};

    if (activeMode === 'FEEDBACK_REVISION' && analysisResult) {
      title = (analysisResult as any).overallAnalysis.title;
      score = (analysisResult as any).rubricEvaluation.globalGrade;
      payloadData = analysisResult;
    } else if (activeMode === 'ARCHITECTURE_NOOB' && architectureGuide) {
      title = `Guía: ${architectureGuide.projectName}`;
      score = 90;
      payloadData = architectureGuide;
    } else if (activeMode === 'PRE_SUBMISSION_AUDIT' && preSubmissionAudit) {
      title = `Auditoría Limpieza (${preSubmissionAudit.cleanScore}%)`;
      score = preSubmissionAudit.cleanScore;
      payloadData = preSubmissionAudit;
    } else if (activeMode === 'SONAR_QUALITY' && sonarQuality) {
      title = `Métricas SonarQube (${sonarQuality.qualityGate})`;
      score = sonarQuality.solidComplianceScore;
      payloadData = sonarQuality;
    }

    try {
      const res = await fetch('/api/user/sessions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userProfile.email,
          sessionData: {
            title,
            personaMode: activeMode,
            score,
            payload: payloadData
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUserProfile(data.user);
        alert('✓ ¡Sesión y resultados guardados correctamente en tu perfil! Ahorraste tokens de API.');
      }
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  const handleLoadSavedSession = (saved: SavedSession) => {
    setActiveMode(saved.personaMode);
    if (saved.personaMode === 'FEEDBACK_REVISION') {
      setAnalysisResult(saved.payload as AnalysisResult);
    } else if (saved.personaMode === 'ARCHITECTURE_NOOB') {
      setArchitectureGuide(saved.payload as ArchitectureGuideResult);
    } else if (saved.personaMode === 'PRE_SUBMISSION_AUDIT') {
      setPreSubmissionAudit(saved.payload as PreSubmissionAuditResult);
    } else if (saved.personaMode === 'SONAR_QUALITY') {
      setSonarQuality(saved.payload as SonarQualityResult);
    }
  };

  const handleLogout = () => {
    setUserProfile(null);
    setAccessToken('');
    setUserEmail('');
    setDriveConnected(false);
    setIsProfileModalOpen(false); // Close the modal after logout
    // Optionally, clear any other session-related data or redirect
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setArchitectureGuide(null);
    setPreSubmissionAudit(null);
    setSonarQuality(null);
    setNoFiles([]);
    setFixedFiles([]);
    setTeacherDoc('');
    setProposedFiles([]);
  };

  const handleGoBackFromExploreModes = () => {
    setShowModalitiesPage(false);
    setCurrentModalitySlug(null); // Navigate back to the main home/campus view
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white">
      
      {/* Navbar */}
      <Navbar
        driveConnected={driveConnected}
        userEmail={userEmail}
        userProfile={userProfile}
        activeMode={activeMode}
        onSelectMode={handleSelectMode}
        onConnectDrive={handleConnectDrive}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <main className="pb-16 bg-white">
        
        {isAnalyzing ? (
          <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4 bg-white" aria-live="polite" aria-busy="true">
            <div className="w-16 h-16 rounded-3xl bg-black/10 border border-black/30 text-black flex items-center justify-center mx-auto shadow-xl animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-black">
              Ejecutando Inteligencia Artificial en Modo: <span className="text-black">{activeMode}</span>
            </h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Analizando estructura de clases Java, aplicando rúbrica universitaria y generando recomendaciones en código.
            </p>
          </div>
        ) : analysisResult ? (
          <AnalysisDashboard
            analysis={analysisResult}
            noFiles={noFiles}
            fixedFiles={fixedFiles}
            teacherDoc={teacherDoc}
            onReset={handleReset}
            onApplyProposal={handleApplyProposal}
            proposedFiles={proposedFiles}
          />
        ) : architectureGuide ? (
          <ArchitectureGuideView
            guide={architectureGuide}
            onReset={handleReset}
            onSaveSession={handleSaveCurrentSession}
            onOpenTutor={(query) => setTutorModalQuery(query)}
          />
        ) : preSubmissionAudit ? (
          <PreSubmissionAuditView // Corrected component name
            audit={preSubmissionAudit}
            onReset={handleReset}
            onSaveSession={handleSaveCurrentSession}
            onOpenTutor={(query) => setTutorModalQuery(query)}
          />
        ) : sonarQuality ? (
          <SonarQualityView
            sonar={sonarQuality}
            onReset={handleReset}
            onSaveSession={handleSaveCurrentSession}
            onOpenTutor={(query) => setTutorModalQuery(query)}
          />
        ) : ( // This is the 'else' for the entire chain, covering !isAnalyzing && !hasAnyResults
          <>
            {currentModalitySlug === 'desde-cero' && activeMode === 'ARCHITECTURE_NOOB' && (
              <DesdeCeroPage
                onBack={() => {
                  setActiveMode('FEEDBACK_REVISION');
                  setCurrentModalitySlug(null);
                  setShowModalitiesPage(true);
                }}
                onStartAnalysis={(files: JavaFile[]) => handleStartAnalysis(files, [], '', {})}
                isAnalyzing={isAnalyzing}
              />
            )}
            {currentModalitySlug === 'antes-de-entregar' && activeMode === 'PRE_SUBMISSION_AUDIT' && (
              <AntesDeEntregarPage
                onBack={() => {
                  setActiveMode('FEEDBACK_REVISION');
                  setCurrentModalitySlug(null);
                  setShowModalitiesPage(true);
                }}
                onStartAnalysis={(files: JavaFile[]) => handleStartAnalysis(files, [], '', {})}
                isAnalyzing={isAnalyzing}
              />
            )}
            {currentModalitySlug === 'corregir-con-feedback' && activeMode === 'FEEDBACK_REVISION' && (
              <CorregirConFeedbackPage
                onBack={() => {
                  setActiveMode('FEEDBACK_REVISION');
                  setCurrentModalitySlug(null);
                  setShowModalitiesPage(true);
                }}
                onStartAnalysis={async (files: JavaFile[], refinementValues: { fixedFiles: JavaFile[], teacherDoc: string }) =>
                  handleStartAnalysis(
                    files, // Corresponds to inputNo for FEEDBACK_REVISION
                    refinementValues.fixedFiles, // Corresponds to inputFixed
                    refinementValues.teacherDoc, // Corresponds to inputTeacher
                    {} // No additional mode-specific options for FEEDBACK_REVISION
                  )
                }
                isAnalyzing={isAnalyzing}
              />
            )}
            {currentModalitySlug === 'buenas-practicas' && activeMode === 'SONAR_QUALITY' && (
              <BuenasPracticasPage
                onBack={() => {
                  setActiveMode('FEEDBACK_REVISION');
                  setCurrentModalitySlug(null);
                  setShowModalitiesPage(true);
                }}
                onStartAnalysis={(files: JavaFile[]) => handleStartAnalysis(files, [], '', {})}
                isAnalyzing={isAnalyzing}
              />
            )}
            {showModalitiesPage && !currentModalitySlug && ( // This block now uses ExploreModesPage
              <ExploreModesPage
                navigateToApp={handleSelectMode} // When a mode is selected, it's essentially navigating to the app for that mode
                goBack={handleGoBackFromExploreModes}
              />
            )}
            {!showModalitiesPage && !currentModalitySlug && (
              <HomePage
                activeMode={activeMode}
                onSelectMode={handleSelectMode}
                onStartAnalysis={handleStartAnalysis}
                onOpenDriveModal={() => {
                  if (!driveConnected) handleConnectDrive();
                  else setIsDriveModalOpen(true);
                }}
                onLoadSample={handleLoadSample}
                isAnalyzing={isAnalyzing}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onOpenTutorWithQuery={(query) => setTutorModalQuery(query)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating JavaBot Onboarding Router Widget */}
      <JavaBotOnboardingWidget
        activeMode={activeMode}
        onSelectMode={handleSelectMode}
        onOpenTutorWithQuery={(query) => setTutorModalQuery(query)}
      />

      {/* Drive Explorer Modal */}
      <DrivePickerModal
        accessToken={accessToken}
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onImportFiles={(importedNo, importedFixed, importedTeacher) => {
          if (importedNo.length > 0) setNoFiles(importedNo);
          if (importedFixed.length > 0) setFixedFiles(importedFixed);
          if (importedTeacher) setTeacherDoc(importedTeacher);
          setIsDriveModalOpen(false);
          alert('¡Archivos importados con éxito desde Google Drive!');
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setUserProfile(user);
        }}
        onConnectDrive={handleConnectDrive}
      />

      {/* User Profile & AI Key Config Modal */}
      {userProfile && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={userProfile}
          onUpdateUser={(updated) => setUserProfile(updated)}
          onLoadSavedSession={handleLoadSavedSession}
          onLogout={handleLogout}
        />
      )}

      {/* Profe Virtual Chat Modal Overlay */}
      {tutorModalQuery !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-3xl">
            <JavaTutorChat
              analysis={analysisResult}
              teacherDoc={teacherDoc}
              initialQuery={tutorModalQuery}
              onClose={() => setTutorModalQuery(null)}
            />
          </div>
            </div>
      )}

    </div>
  );
}