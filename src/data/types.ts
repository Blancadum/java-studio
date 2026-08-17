export type FileVersion = 'Zip_original' | 'Zip_fixed' | 'PROPOSED';

export type StudentPersonaMode = 
  | 'FEEDBACK_REVISION'   // Subsanación post-suspenso / Notas del Profesor
  | 'ARCHITECTURE_NOOB'   // Modo Iniciación / Desde Cero con Enunciado
  | 'PRE_SUBMISSION_AUDIT'// Limpieza pre-entrega, chequeo de rúbrica y anti-IA
  | 'SONAR_QUALITY';      // Buenas prácticas SonarQube, SOLID y JUnit

export interface JavaFile {
  id: string;
  name: string;
  path: string;
  content: string;
  version: FileVersion;
}

export type RequirementCategory = 'OOP' | 'EXCEPTIONS' | 'COLLECTIONS' | 'TESTS' | 'DOCUMENTATION' | 'ARCHITECTURE' | 'OTHER';

export type RequirementPriority = 'CRITICAL' | 'RECOMMENDED' | 'EXTRA';

export type RequirementStatus = 'SATISFIED' | 'PARTIAL' | 'MISSING';

export interface TeacherRecommendation {
  id: string;
  title: string;
  category: RequirementCategory;
  description: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  teacherNote?: string;
  location?: string;
}

export interface ImprovementProposal {
  id: string;
  fileTarget: string;
  issueTitle: string;
  category: RequirementCategory;
  description: string;
  originalCode: string;
  proposedCode: string;
  explanation: string;
  fulfillsTeacherPoint?: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  applied?: boolean;
}

export interface AnalysisResult {
  overallScore: number; // 0-100 score (e.g. 85%)
  passLikelihood: 'ALTA' | 'MEDIA' | 'BAJA' | 'REQUIERE_CAMBIOS';
  teacherComplianceScore: number; // 0-100
  summary: string;
  keyStrengths: string[];
  criticalGaps: string[];
  recommendations: TeacherRecommendation[];
  proposals: ImprovementProposal[];
  generalAdvice: string[];
}

// ----------------------------------------------------
// 1. BUYER PERSONA SPECIALIZED ANALYSIS TYPES
// ----------------------------------------------------

// Modo 2: Noob Guide / Architecture from Enunciado
export interface ArchitectureGuideResult {
  projectName: string;
  summary: string;
  architectureType: string; // e.g. MVC, Layered, Clean OOP
  recommendedClasses: {
    className: string;
    packagePath: string;
    type: 'class' | 'interface' | 'enum' | 'exception';
    purpose: string;
    keyMethods: string[];
    suggestedAttributes: string[];
  }[];
  roadmapSteps: {
    stepNumber: number;
    title: string;
    description: string;
    targetClass: string;
    tips: string;
  }[];
  conceptChecklist: string[];
}

// Modo 3: Pre-submission audit
export interface PreSubmissionAuditResult {
  cleanScore: number; // 0-100
  readyToSubmit: boolean;
  detectedIssues: {
    id: string;
    type: 'AI_ARTIFACT' | 'HIDDEN_FILE' | 'NAMING_CONVENTION' | 'MISSING_PACKAGE' | 'DELIVERY_FORMAT';
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    location: string;
    snippet?: string;
    suggestedFix: string;
  }[];
  rubricChecks: {
    item: string;
    passed: boolean;
    note: string;
  }[];
  summary: string;
}

// Modo 4: SonarQube & SOLID
export interface SonarQualityResult {
  qualityGate: 'PASSED' | 'FAILED' | 'WARNING';
  codeSmellsCount: number;
  cyclomaticComplexityRating: 'A' | 'B' | 'C' | 'D' | 'F';
  solidComplianceScore: number; // 0-100
  issues: {
    ruleId: string; // e.g. "java:S112", "java:S106"
    ruleName: string;
    severity: 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR';
    fileTarget: string;
    lineNumber?: number;
    description: string;
    refactoringHint: string;
  }[];
  junitRecommendations: {
    targetClass: string;
    suggestedTests: string[];
  }[];
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

// ----------------------------------------------------
// 2. USER AUTH, SESSIONS & MULTI-AI CONFIG TYPES
// ----------------------------------------------------

export type AiProvider = 'app_default' | 'user_gemini' | 'backup_fallback';

export interface UserApiConfig {
  preferredProvider: AiProvider;
  geminiUserKey?: string;
  backupUserKey?: string;
  activeModelName: string;
  maskedGeminiKey?: string;
  maskedBackupKey?: string;
  fallbackEnabled: boolean;
}

export interface SavedSession {
  id: string;
  title: string;
  createdAt: string;
  personaMode: StudentPersonaMode;
  score: number;
  tokensSaved: number;
  summary: string;
  payload: {
    noFiles?: JavaFile[];
    fixedFiles?: JavaFile[];
    teacherDoc?: string;
    analysisResult?: AnalysisResult;
    architectureResult?: ArchitectureGuideResult;
    auditResult?: PreSubmissionAuditResult;
    sonarResult?: SonarQualityResult;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  institution?: string;
  totalTokensSaved: number;
  apiConfig: UserApiConfig;
  twoFactorAuth: {
    enabled: boolean;
    secret?: string;
  };
  sessions: SavedSession[];
}

// Interface for legal content sections
export interface LegalSectionItem {
  title: string;
  content: React.ReactNode;
}

// Define PageType as a union of known page strings
export type PageType =
  | 'home'
  | 'campus'
  | 'app-desde-cero'
  | 'app-antes-de-entregar'
  | 'app-corregir-feedback'
  | 'app-buenas-practicas'
  | 'documentation'
  | 'mode-detail-buenas-practicas'
  | 'mode-detail-antes-de-entregar'
  | 'mode-detail-desde-cero'
  | 'mode-detail-corregir-feedback'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'explore-modes'; // Added explore-modes
