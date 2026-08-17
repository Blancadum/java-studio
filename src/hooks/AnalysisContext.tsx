import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useWorkspace } from '../components/campus/WorkspaceContext';
import {
  AnalysisResult,
  JavaFile,
  ImprovementProposal,
  StudentPersonaMode,
  UserProfile,
  SavedSession,
  ArchitectureGuideResult,
  PreSubmissionAuditResult,
  SonarQualityResult,
} from '../data/types';
import { INITIAL_SAMPLE_ANALYSIS, SAMPLE_NO_FILES, SAMPLE_FIXED_FILES, SAMPLE_TEACHER_DOC } from '../data/sampleProject';
import { api } from '../lib/api';
import { getAnalysisApiConfig, ApiConfig } from '../lib/analysisConfig';

interface AnalysisContextType {
  // State
  activeMode: StudentPersonaMode;
  setActiveMode: (mode: StudentPersonaMode) => void;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  architectureGuide: ArchitectureGuideResult | null;
  preSubmissionAudit: PreSubmissionAuditResult | null;
  sonarQuality: SonarQualityResult | null;
  tutorModalQuery: string | null;
  setTutorModalQuery: (query: string | null) => void;
  proposedFiles: JavaFile[];
  hasAnyResults: boolean;

  // Actions
  handleLoadSample: () => void;
  handleSelectMode: (mode: StudentPersonaMode) => void;
  handleStartAnalysis: (
    noFiles: JavaFile[],
    fixedFiles: JavaFile[],
    teacherDoc: string,
    modeSpecificOptions?: any
  ) => Promise<void>;
  handleApplyProposal: (proposal: ImprovementProposal) => Promise<void>;
  handleSaveCurrentSession: () => Promise<void>;
  handleLoadSavedSession: (session: SavedSession) => void;
  handleReset: () => void;
}

export const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

interface AnalysisProviderProps {
  children: React.ReactNode;
  userProfile: UserProfile | null;
  onOpenAuthModal: () => void;
  onUpdateUserProfile: (user: UserProfile) => void;
}

export function AnalysisProvider({
  children,
  userProfile,
  onOpenAuthModal,
  onUpdateUserProfile,
}: AnalysisProviderProps) {
  const { noFiles, setNoFiles, fixedFiles, setFixedFiles, teacherDoc, setTeacherDoc } = useWorkspace();

  const [activeMode, setActiveMode] = useState<StudentPersonaMode>('FEEDBACK_REVISION');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [architectureGuide, setArchitectureGuide] = useState<ArchitectureGuideResult | null>(null);
  const [preSubmissionAudit, setPreSubmissionAudit] = useState<PreSubmissionAuditResult | null>(null);
  const [sonarQuality, setSonarQuality] = useState<SonarQualityResult | null>(null);
  const [tutorModalQuery, setTutorModalQuery] = useState<string | null>(null);
  const [proposedFiles, setProposedFiles] = useState<JavaFile[]>([]);

  const handleLoadSample = useCallback(() => {
    setActiveMode('FEEDBACK_REVISION');
    setNoFiles(SAMPLE_NO_FILES);
    setFixedFiles(SAMPLE_FIXED_FILES);
    setTeacherDoc(SAMPLE_TEACHER_DOC);
    setAnalysisResult(INITIAL_SAMPLE_ANALYSIS);

    const initialProposed = SAMPLE_FIXED_FILES.map((f) => ({
      ...f,
      version: 'PROPOSED' as const,
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
}`,
    });

    setProposedFiles(initialProposed);
  }, [setNoFiles, setFixedFiles, setTeacherDoc]);

  const handleSelectMode = useCallback((mode: StudentPersonaMode) => {
    setActiveMode(mode);
    // Reset results when mode changes
    setAnalysisResult(null);
    setArchitectureGuide(null);
    setPreSubmissionAudit(null);
    setSonarQuality(null);
  }, []);

  const handleReset = useCallback(() => {
    setAnalysisResult(null);
    setArchitectureGuide(null);
    setPreSubmissionAudit(null);
    setSonarQuality(null);
    setNoFiles([]);
    setFixedFiles([]);
    setTeacherDoc('');
    setProposedFiles([]);
  }, [setNoFiles, setFixedFiles, setTeacherDoc]);

  // Memoize API config
  const ANALYSIS_API_CONFIG = useMemo(
    () =>
      getAnalysisApiConfig({
        setAnalysisResult,
        setArchitectureGuide,
        setPreSubmissionAudit,
        setSonarQuality,
        setProposedFiles,
        setFixedFiles,
      }),
    [setFixedFiles]
  );

  const handleStartAnalysis = useCallback(
    async (
      inputNo: JavaFile[],
      inputFixed: JavaFile[],
      inputTeacher: string,
      modeSpecificOptions: any = {}
    ) => {
      setNoFiles(inputNo);
      setFixedFiles(inputFixed);
      setTeacherDoc(inputTeacher);
      setIsAnalyzing(true);

      const apiOptions = userProfile
        ? {
            preferredProvider: userProfile.apiConfig?.preferredProvider,
            geminiUserKey: userProfile.apiConfig?.geminiUserKey,
            backupUserKey: userProfile.apiConfig?.backupUserKey,
            fallbackEnabled: userProfile.apiConfig?.fallbackEnabled,
          }
        : {};

      try {
        const config = ANALYSIS_API_CONFIG[activeMode];
        if (!config) {
          throw new Error(`Modo de análisis no configurado: ${activeMode}`);
        }

        const payload = config.buildPayload({
          inputNo,
          inputFixed,
          inputTeacher,
          modeSpecificOptions,
          apiOptions,
        });

        const res = await fetch(config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
          config.onSuccess(data);
        } else {
          config.onError(data.error || 'Respuesta fallida de la API');
        }
      } catch (err: any) {
        alert('Error de conexión al analizar: ' + err.message);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [activeMode, userProfile, setNoFiles, setFixedFiles, setTeacherDoc, ANALYSIS_API_CONFIG]
  );

  const handleApplyProposal = useCallback(async (proposal: ImprovementProposal) => {
    const existingIndex = proposedFiles.findIndex(
      (f) => f.path === proposal.fileTarget || f.name === proposal.fileTarget.split('/').pop()
    );

    if (existingIndex >= 0) {
      let finalCode = proposal.proposedCode;
      try {
        const fileToUpdate = proposedFiles[existingIndex];
        const res = await api.generateImprovedFile({
          fileTarget: fileToUpdate.name,
          currentCode: fileToUpdate.content,
          proposalsToApply: [proposal],
          teacherDoc,
        });
        if (res.updatedCode) {
          finalCode = res.updatedCode;
        }
      } catch (error) {
        console.error('API call for improved file failed, using fallback:', error);
      }

      setProposedFiles((prev) => {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          content: finalCode,
        };
        return updated;
      });
    } else {
      setProposedFiles((prev) => [
        ...prev,
        {
          id: proposal.id,
          name: proposal.fileTarget.split('/').pop() || proposal.fileTarget,
          path: proposal.fileTarget,
          content: proposal.proposedCode,
          version: 'PROPOSED',
        },
      ]);
    }
  }, [proposedFiles, teacherDoc]);

  const handleSaveCurrentSession = useCallback(async () => {
    if (!userProfile) {
      onOpenAuthModal();
      return;
    }

    let title = 'Análisis de Proyecto Java II';
    let score = 85;
    let summary = 'Análisis general de un proyecto Java.';
    let tokensSaved = 0;
    let payloadData: any = {};

    if (activeMode === 'FEEDBACK_REVISION' && analysisResult) {
      title = (analysisResult as any).overallAnalysis.title;
      score = (analysisResult as any).rubricEvaluation.globalGrade;
      summary = analysisResult.summary;
      payloadData = analysisResult;
      tokensSaved = JSON.stringify(analysisResult).length * 2;
    } else if (activeMode === 'ARCHITECTURE_NOOB' && architectureGuide) {
      title = `Guía: ${architectureGuide.projectName}`;
      score = 90;
      payloadData = architectureGuide;
    } else if (activeMode === 'PRE_SUBMISSION_AUDIT' && preSubmissionAudit) {
      title = `Auditoría Limpieza (${preSubmissionAudit.cleanScore}%)`;
      score = preSubmissionAudit.cleanScore;
      payloadData = preSubmissionAudit;
      summary = preSubmissionAudit.summary;
      tokensSaved = JSON.stringify(preSubmissionAudit).length;
    } else if (activeMode === 'SONAR_QUALITY' && sonarQuality) {
      title = `Métricas SonarQube (${sonarQuality.qualityGate})`;
      score = sonarQuality.solidComplianceScore;
      payloadData = sonarQuality;
      summary = `Quality Gate: ${sonarQuality.qualityGate}, ${sonarQuality.codeSmellsCount} code smells.`;
      tokensSaved = JSON.stringify(sonarQuality).length;
    }

    try {
      const res = await api.saveUserSession(userProfile.email, {
        title,
        summary,
        personaMode: activeMode,
        score,
        tokensSaved,
        payload: payloadData,
      });

      if (res.success && res.user) {
        onUpdateUserProfile(res.user);
        alert('✓ ¡Sesión y resultados guardados correctamente en tu perfil! Ahorraste tokens de API.');
      }
    } catch (err) {
      console.error('Error saving session:', err);
      alert('Error al guardar la sesión: ' + (err as Error).message);
    }
  }, [userProfile, activeMode, analysisResult, architectureGuide, preSubmissionAudit, sonarQuality, onOpenAuthModal, onUpdateUserProfile]);

  const handleLoadSavedSession = useCallback((saved: SavedSession) => {
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
  }, []);

  const hasAnyResults = !!(analysisResult || architectureGuide || preSubmissionAudit || sonarQuality);

  const value: AnalysisContextType = {
    activeMode,
    setActiveMode,
    isAnalyzing,
    analysisResult,
    architectureGuide,
    preSubmissionAudit,
    sonarQuality,
    tutorModalQuery,
    setTutorModalQuery,
    proposedFiles,
    hasAnyResults,
    handleLoadSample,
    handleSelectMode,
    handleStartAnalysis,
    handleApplyProposal,
    handleSaveCurrentSession,
    handleLoadSavedSession,
    handleReset,
  };

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysisContext() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysisContext must be used within AnalysisProvider');
  }
  return context;
}
