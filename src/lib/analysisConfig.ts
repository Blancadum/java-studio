import {
  StudentPersonaMode,
  JavaFile,
  AnalysisResult,
  ArchitectureGuideResult,
  PreSubmissionAuditResult,
  SonarQualityResult,
} from '../data/types';

type ApiOptions = {
  preferredProvider?: string;
  geminiUserKey?: string;
  backupUserKey?: string;
  fallbackEnabled?: boolean;
};

export type ApiConfig = {
  endpoint: string;
  buildPayload: (inputs: {
    inputNo: JavaFile[];
    inputFixed: JavaFile[];
    inputTeacher: string;
    modeSpecificOptions: any;
    apiOptions: ApiOptions;
  }) => Record<string, any>;
  onSuccess: (data: any) => void;
  onError: (errorMsg: string) => void;
};

interface AnalysisSetters {
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setArchitectureGuide: (result: ArchitectureGuideResult | null) => void;
  setPreSubmissionAudit: (result: PreSubmissionAuditResult | null) => void;
  setSonarQuality: (result: SonarQualityResult | null) => void;
  setProposedFiles: React.Dispatch<React.SetStateAction<JavaFile[]>>;
  setFixedFiles: React.Dispatch<React.SetStateAction<JavaFile[]>>;
}

export const getAnalysisApiConfig = (setters: AnalysisSetters): Record<StudentPersonaMode, ApiConfig> => ({
  FEEDBACK_REVISION: {
    endpoint: '/api/analyze/java-project',
    buildPayload: ({ inputNo, inputFixed, inputTeacher, apiOptions }) => ({
      noFiles: inputNo,
      fixedFiles: inputFixed,
      teacherDoc: inputTeacher,
      apiOptions,
    }),
    onSuccess: (data: AnalysisResult) => {
      setters.setAnalysisResult(data);
      setters.setFixedFiles(currentFixedFiles => {
        setters.setProposedFiles(currentFixedFiles.map(f => ({ ...f, version: 'PROPOSED' as const })));
        return currentFixedFiles;
      });
    },
    onError: (errorMsg: string) => alert(`Error en evaluación: ${errorMsg}`),
  },
  ARCHITECTURE_NOOB: {
    endpoint: '/api/analyze/noob-architecture',
    buildPayload: ({ inputTeacher, modeSpecificOptions, apiOptions }) => ({
      statementText: modeSpecificOptions.statementText || inputTeacher || 'Enunciado de práctica de Java II',
      ...modeSpecificOptions,
      apiOptions,
    }),
    onSuccess: setters.setArchitectureGuide,
    onError: (errorMsg: string) => alert(`Error en arquitectura: ${errorMsg}`),
  },
  PRE_SUBMISSION_AUDIT: {
    endpoint: '/api/analyze/pre-submission-audit',
    buildPayload: ({ inputNo, inputFixed, inputTeacher, modeSpecificOptions, apiOptions }) => ({
      files: inputNo.concat(inputFixed),
      teacherRubricText: inputTeacher,
      ...modeSpecificOptions,
      apiOptions,
    }),
    onSuccess: setters.setPreSubmissionAudit,
    onError: (errorMsg: string) => alert(`Error en auditoría pre-entrega: ${errorMsg}`),
  },
  SONAR_QUALITY: {
    endpoint: '/api/analyze/sonar-quality',
    buildPayload: ({ inputNo, inputFixed, modeSpecificOptions, apiOptions }) => ({
      files: inputNo.concat(inputFixed),
      ...modeSpecificOptions,
      apiOptions,
    }),
    onSuccess: setters.setSonarQuality,
    onError: (errorMsg: string) => alert(`Error en auditoría SonarQube: ${errorMsg}`),
  },
});