import React from 'react';
import { ArrowRight } from 'lucide-react';
import { StudentPersonaMode } from '../data/types';
import { MODES_CONFIG } from '../data/modes';
import { Reveal } from '../components/reveal/Reveal';
import styles from './HomePage.module.css';

interface ModesPageProps {
  onSelectMode: (mode: StudentPersonaMode) => void;
  onNavigateToMode: (modeSlug: string) => void;
}

export const ModesPage: React.FC<ModesPageProps> = ({ onSelectMode, onNavigateToMode }) => {
  const modeToSlug = (modeId: StudentPersonaMode): string => {
    const slugMap: Record<StudentPersonaMode, string> = {
      'FEEDBACK_REVISION': 'feedback-revision',
      'ARCHITECTURE_NOOB': 'architecture-noob',
      'PRE_SUBMISSION_AUDIT': 'pre-submission-audit',
      'SONAR_QUALITY': 'sonar-quality',
    };
    return slugMap[modeId];
  };

  return (
    <div className={styles.container}>
      {/* MODES SECTION */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionEyebrow}>
              ▪ MODOS ACADÉMICOS DE TRABAJO
            </div>
            <h2 className={styles.sectionTitle}>
              Cuatro perfiles adaptados a tu momento académico
            </h2>
          </div>
          <p className={styles.sectionDescription}>
            Cada modo activa un motor de IA especializado para tu evaluación.
          </p>
        </div>

        <div className={styles.modesGrid}>
          {MODES_CONFIG.map((mode, i) => (
            <Reveal key={mode.id} delay={i * 80}>
              <div
                onClick={() => {
                  onSelectMode(mode.id);
                  onNavigateToMode(modeToSlug(mode.id));
                }}
                className={`${styles.modeCard} ${styles.inactive} cursor-pointer hover:shadow-lg transition-shadow`}
              >
                <div className={styles.modeCardHeader}>
                  <div className={`${styles.modeCardIconContainer} text-${mode.colorClass}-600`}>
                    {mode.icon}
                  </div>
                </div>
                
                <div>
                  <h3 className={styles.modeCardTitle}>
                    {mode.title}
                  </h3>
                </div>

                <p className={styles.modeCardDescription}>
                  {mode.desc}
                </p>

                <div className={styles.modeCardAction}>
                  <span>Explorar</span>
                  <ArrowRight className={styles.modeCardArrow} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
};
