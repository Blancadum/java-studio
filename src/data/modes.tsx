import React from 'react';
import { FileText, Compass, ShieldCheck, Award } from 'lucide-react';
import { StudentPersonaMode } from './types';

interface ModeConfig { // Definición de la interfaz para el tipo de configuración de modo
  id: StudentPersonaMode; 
  num: string;
  title: string; 
  subtitle: string;
  shortTitle: string;
  badge: string; 
  desc: string;
  icon: React.ReactNode; 
  colorClass: string;
  bgBadge: string;
  textBadge: string;
  borderBadge: string;
}

export const MODES_CONFIG: ModeConfig[] = [
  {
    id: 'FEEDBACK_REVISION',
    num: '001',
    title: 'Track / Subsanación Feedback',
    subtitle: 'Post-Suspenso & Comparativa AST',
    shortTitle: 'Subsanación',
    badge: 'Post-Suspenso',
    desc: 'Compara tu borrador o entrega inicial contra las observaciones de tu profesora o las correcciones. Detecta discrepancias de firmas, visibilidad y cumplimiento de rúbrica.',
    icon: <FileText className="w-5 h-5" />, // Eliminada clase de color redundante
    colorClass: 'amber',
    bgBadge: 'bg-amber-50',
    textBadge: 'text-amber-800',
    borderBadge: 'border-amber-200'
  },
  {
    id: 'ARCHITECTURE_NOOB',
    num: '002',
    title: 'Model / Guía POO (Enunciados)',
    subtitle: 'Iniciación & Cero Parálisis',
    shortTitle: 'Guía POO',
    badge: 'Iniciación',
    desc: 'Desglosa enunciados complejos de examen o prácticas en esqueletos POO con clases, atributos privados, interfaces y marcas // TODO para programar autónomamente.',
    icon: <Compass className="w-5 h-5" />, // Eliminada clase de color redundante
    colorClass: 'indigo',
    bgBadge: 'bg-indigo-50',
    textBadge: 'text-indigo-800',
    borderBadge: 'border-indigo-200'
  },
  {
    id: 'PRE_SUBMISSION_AUDIT',
    num: '003',
    title: 'Report / Pre-Entrega & Anti-IA',
    subtitle: 'Higiene de Proyecto & Rúbrica',
    shortTitle: 'Pre-Entrega',
    badge: 'Higiene & Rúbrica',
    desc: 'Sube tu .ZIP antes de entregar. Purga carpetas temporales de IDE (.idea, target), desinfecta comentarios con huellas delatadoras de IA y valida tu score académico.',
    icon: <ShieldCheck className="w-5 h-5" />, // Eliminada clase de color redundante
    colorClass: 'emerald',
    bgBadge: 'bg-emerald-50',
    textBadge: 'text-emerald-800',
    borderBadge: 'border-emerald-200'
  },
  {
    id: 'SONAR_QUALITY',
    num: '004',
    title: 'Act / SonarQube & SOLID',
    subtitle: 'Calidad Industrial & JUnit 5',
    shortTitle: 'SonarQube',
    badge: 'Calidad Industrial',
    desc: 'Mide la Complejidad Cognitiva (S3776 < 15), elimina duplicaciones, valida principios SOLID y autogenera suites completas de pruebas unitarias con JUnit 5.',
    icon: <Award className="w-5 h-5" />, // Eliminada clase de color redundante
    colorClass: 'sky',
    bgBadge: 'bg-sky-50',
    textBadge: 'text-sky-800',
    borderBadge: 'border-sky-200'
  }
];