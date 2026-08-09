import React from 'react';
import { FileText, Compass, ShieldCheck, Award } from 'lucide-react';
import { StudentPersonaMode } from './types';

export const MODES_CONFIG: { 
  id: StudentPersonaMode; 
  num: string;
  title: string; 
  shortTitle: string;
  badge: string; 
  desc: string;
  icon: React.ReactNode; 
  colorClass: string;
  bgBadge: string;
  textBadge: string;
  borderBadge: string;
}[] = [
  {
    id: 'FEEDBACK_REVISION',
    num: '001',
    title: 'Track / Subsanación Feedback',
    shortTitle: 'Subsanación',
    badge: 'Post-Suspenso',
    desc: 'Compara tu borrador o entrega inicial contra las observaciones de tu profesora o las correcciones. Detecta discrepancias de firmas, visibilidad y cumplimiento de rúbrica.',
    icon: <FileText className="w-5 h-5 text-amber-600" />,
    colorClass: 'amber',
    bgBadge: 'bg-amber-50',
    textBadge: 'text-amber-800',
    borderBadge: 'border-amber-200'
  },
  {
    id: 'ARCHITECTURE_NOOB',
    num: '002',
    title: 'Model / Guía POO (Enunciados)',
    shortTitle: 'Guía POO',
    badge: 'Iniciación',
    desc: 'Desglosa enunciados complejos de examen o prácticas en esqueletos POO con clases, atributos privados, interfaces y marcas // TODO para programar autónomamente.',
    icon: <Compass className="w-5 h-5 text-indigo-600" />,
    colorClass: 'indigo',
    bgBadge: 'bg-indigo-50',
    textBadge: 'text-indigo-800',
    borderBadge: 'border-indigo-200'
  },
  {
    id: 'PRE_SUBMISSION_AUDIT',
    num: '003',
    title: 'Report / Pre-Entrega & Anti-IA',
    shortTitle: 'Pre-Entrega',
    badge: 'Higiene & Rúbrica',
    desc: 'Sube tu .ZIP antes de entregar. Purga carpetas temporales de IDE (.idea, target), desinfecta comentarios con huellas delatadoras de IA y valida tu score académico.',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    colorClass: 'emerald',
    bgBadge: 'bg-emerald-50',
    textBadge: 'text-emerald-800',
    borderBadge: 'border-emerald-200'
  },
  {
    id: 'SONAR_QUALITY',
    num: '004',
    title: 'Act / SonarQube & SOLID',
    shortTitle: 'SonarQube',
    badge: 'Calidad Industrial',
    desc: 'Mide la Complejidad Cognitiva (S3776 < 15), elimina duplicaciones, valida principios SOLID y autogenera suites completas de pruebas unitarias con JUnit 5.',
    icon: <Award className="w-5 h-5 text-sky-600" />,
    colorClass: 'sky',
    bgBadge: 'bg-sky-50',
    textBadge: 'text-sky-800',
    borderBadge: 'border-sky-200'
  }
];