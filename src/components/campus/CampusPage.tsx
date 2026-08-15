import React from 'react';
import { MODALITY_CONFIGS, MODE_TO_SLUG } from '../modality/modalityConfig';
import { StudentPersonaMode } from '../../data/types';
import styles from './CampusPage.module.css';

interface CampusPageProps {
  onSelectModality: (mode: StudentPersonaMode) => void;
}

const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
  switch (difficulty) {
    case 'beginner':
      return '#10b981'; // emerald
    case 'intermediate':
      return '#f59e0b'; // amber
    case 'advanced':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

const getDifficultyLabel = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
  switch (difficulty) {
    case 'beginner':
      return 'Principiante';
    case 'intermediate':
      return 'Intermedio';
    case 'advanced':
      return 'Avanzado';
    default:
      return 'N/A';
  }
};

export const CampusPage: React.FC<CampusPageProps> = ({ onSelectModality }) => {
  const modes: StudentPersonaMode[] = ['ARCHITECTURE_NOOB', 'PRE_SUBMISSION_AUDIT', 'FEEDBACK_REVISION', 'SONAR_QUALITY'];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Campus</h1>
        <p className={styles.subtitle}>Selecciona la modalidad que necesitas</p>
      </div>

      {/* Modality Cards */}
      <div className={styles.cardGrid}>
        {modes.map(mode => {
          const config = MODALITY_CONFIGS[mode];
          const slug = MODE_TO_SLUG[mode];

          return (
            <div
              key={mode}
              className={styles.card}
              onClick={() => onSelectModality(mode)}
            >
              {/* Difficulty Badge */}
              <div className={styles.cardHeader}>
                <span
                  className={styles.difficultyBadge}
                  style={{ backgroundColor: `${getDifficultyColor(config.difficulty)}20`, color: getDifficultyColor(config.difficulty) }}
                >
                  {getDifficultyLabel(config.difficulty)}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 className={styles.cardTitle}>{config.title}</h2>
              <p className={styles.cardSubtitle}>{config.subtitle}</p>

              {/* Description */}
              <p className={styles.cardDescription}>{config.description}</p>

              {/* Files Required */}
              <div className={styles.fileReqs}>
                <p className={styles.fileReqsLabel}>Archivos requeridos:</p>
                <ul className={styles.fileReqsList}>
                  {config.fileRequirements.map(req => (
                    <li key={req.id} className={styles.fileReqsItem}>
                      {req.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className={styles.cardFooter}>
                <button className={styles.cardButton}>
                  Iniciar análisis →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
