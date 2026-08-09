import { StudentPersonaMode } from '../../data/types';

export interface ModeOption {
  id: StudentPersonaMode;
  label: string;
  desc: string;
  color: string;
}

export const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'FEEDBACK_REVISION',
    label: 'Subsanación',
    desc: 'Borrador vs comentarios docente',
    color: '#f59e0b',
  },
  {
    id: 'ARCHITECTURE_NOOB',
    label: 'Guía POO',
    desc: 'Clases, paquetes y UML',
    color: '#6366f1',
  },
  {
    id: 'PRE_SUBMISSION_AUDIT',
    label: 'Pre-entrega',
    desc: 'Higiene de archivos y anti-IA',
    color: '#10b981',
  },
  {
    id: 'SONAR_QUALITY',
    label: 'SonarQube',
    desc: 'Métricas de calidad industrial',
    color: '#0ea5e9',
  },
];
