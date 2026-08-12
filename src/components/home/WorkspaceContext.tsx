import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { JavaFile } from '../../data/types';

// Define the shape of the context state
interface WorkspaceContextState {
  // File state
  noFiles: JavaFile[];
  setNoFiles: React.Dispatch<React.SetStateAction<JavaFile[]>>;
  fixedFiles: JavaFile[];
  setFixedFiles: React.Dispatch<React.SetStateAction<JavaFile[]>>;
  teacherDoc: string;
  setTeacherDoc: React.Dispatch<React.SetStateAction<string>>;

  // ARCHITECTURE_NOOB state
  statementText: string;
  setStatementText: React.Dispatch<React.SetStateAction<string>>;
  includeInterfaces: boolean;
  setIncludeInterfaces: React.Dispatch<React.SetStateAction<boolean>>;
  useLombok: boolean;
  setUseLombok: React.Dispatch<React.SetStateAction<boolean>>;
  generateTodoComments: boolean;
  setGenerateTodoComments: React.Dispatch<React.SetStateAction<boolean>>;
  javaVersion: '17' | '21' | '11';
  setJavaVersion: React.Dispatch<React.SetStateAction<'17' | '21' | '11'>>;

  // PRE_SUBMISSION_AUDIT state
  purgeFolders: boolean;
  setPurgeFolders: React.Dispatch<React.SetStateAction<boolean>>;
  sanitizeAiComments: boolean;
  setSanitizeAiComments: React.Dispatch<React.SetStateAction<boolean>>;
  checkRubric: boolean;
  setCheckRubric: React.Dispatch<React.SetStateAction<boolean>>;

  // SONAR_QUALITY state
  evalS3776: boolean;
  setEvalS3776: React.Dispatch<React.SetStateAction<boolean>>;
  evalStringConcat: boolean;
  setEvalStringConcat: React.Dispatch<React.SetStateAction<boolean>>;
  generateJunit5: boolean;
  setGenerateJunit5: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default undefined value
const WorkspaceContext = createContext<WorkspaceContextState | undefined>(undefined);

// Create a provider component
export const WorkspaceProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  // State for files
  const [noFiles, setNoFiles] = useState<JavaFile[]>([]);
  const [fixedFiles, setFixedFiles] = useState<JavaFile[]>([]);
  const [teacherDoc, setTeacherDoc] = useState<string>('');

  // State for ARCHITECTURE_NOOB
  const [statementText, setStatementText] = useState('');
  const [includeInterfaces, setIncludeInterfaces] = useState(true);
  const [useLombok, setUseLombok] = useState(false);
  const [generateTodoComments, setGenerateTodoComments] = useState(true);
  const [javaVersion, setJavaVersion] = useState<'17' | '21' | '11'>('17');

  // State for PRE_SUBMISSION_AUDIT
  const [purgeFolders, setPurgeFolders] = useState(true);
  const [sanitizeAiComments, setSanitizeAiComments] = useState(true);
  const [checkRubric, setCheckRubric] = useState(true);

  // State for SONAR_QUALITY
  const [evalS3776, setEvalS3776] = useState(true);
  const [evalStringConcat, setEvalStringConcat] = useState(false);
  const [generateJunit5, setGenerateJunit5] = useState(true);

  const value = {
    noFiles, setNoFiles,
    fixedFiles, setFixedFiles,
    teacherDoc, setTeacherDoc,
    statementText, setStatementText,
    includeInterfaces, setIncludeInterfaces,
    useLombok, setUseLombok,
    generateTodoComments, setGenerateTodoComments,
    javaVersion, setJavaVersion,
    purgeFolders, setPurgeFolders,
    sanitizeAiComments, setSanitizeAiComments,
    checkRubric, setCheckRubric,
    evalS3776, setEvalS3776,
    evalStringConcat, setEvalStringConcat,
    generateJunit5, setGenerateJunit5,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

// Create a custom hook for easy consumption
export const useWorkspace = (): WorkspaceContextState => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};