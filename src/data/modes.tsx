import React from 'react';
import { FileText, Compass, ShieldCheck, Award } from 'lucide-react';
import { StudentPersonaMode } from './types';

interface ModeConfig { // Definición de la interfaz para el tipo de configuración de modo
  id: StudentPersonaMode; 
  num: string;
  title: string; 
  description: string; // Ensure this is the single description property
  subtitle: string;
  shortTitle: string;
  badge: string; 
  'prof-description': string; // Ensure this matches the interface
  icon: React.ReactNode; // Keep icon
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
    description: 'Mejora iterativa basada en retroalimentación real. Entiende qué te pedía el profesor y cómo tu código responde.', // Use description consistently
    subtitle: 'Post-Suspenso & Comparativa AST', // Keep subtitle
    shortTitle: 'Subsanación',
    badge: 'Post-Suspenso',
    'prof-description': 'Compara tu borrador o entrega inicial contra las observaciones de tu profesora o las correcciones. Detecta discrepancias de firmas, visibilidad y cumplimiento de rúbrica.',
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
    description: 'Desglosa enunciados complejos de examen o prácticas en esqueletos POO con clases, atributos privados, interfaces y marcas // TODO para programar autónomamente.', // Use description consistently
    subtitle: 'Iniciación & Cero Parálisis', // Keep subtitle
    shortTitle: 'Guía POO',
    badge: 'Iniciación',
    'prof-description': 'Desglosa enunciados complejos de examen o prácticas en esqueletos POO con clases, atributos privados, interfaces y marcas // TODO para programar autónomamente.',
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
    description: 'Sube tu .ZIP antes de entregar. Purga carpetas temporales de IDE (.idea, target), desinfecta comentarios con huellas delatadoras de IA y valida tu score académico.', // Use description consistently
    subtitle: 'Higiene de Proyecto & Rúbrica', // Keep subtitle
    shortTitle: 'Pre-Entrega',
    badge: 'Higiene & Rúbrica',
    'prof-description': 'Sube tu .ZIP antes de entregar. Purga carpetas temporales de IDE (.idea, target), desinfecta comentarios con huellas delatadoras de IA y valida tu score académico.',
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
    description: 'Mide la Complejidad Cognitiva (S3776 < 15), elimina duplicaciones, valida principios SOLID y autogenera suites completas de pruebas unitarias con JUnit 5.', // Use description consistently
    subtitle: 'Calidad Industrial & JUnit 5',
    shortTitle: 'SonarQube',
    badge: 'Calidad Industrial',
    'prof-description': 'Mide la Complejidad Cognitiva (S3776 < 15), elimina duplicaciones, valida principios SOLID y autogenera suites completas de pruebas unitarias con JUnit 5.',
    icon: <Award className="w-5 h-5" />, // Eliminada clase de color redundante
    colorClass: 'sky',
    bgBadge: 'bg-sky-50',
    textBadge: 'text-sky-800',
    borderBadge: 'border-sky-200'
  }
];