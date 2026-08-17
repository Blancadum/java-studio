import React from 'react';
// import { useNavigationContext } from '../../../hooks/NavigationContext'; // REMOVE THIS
import { MODES_CONFIG } from '../../../data/modes'; 
import { PageType, StudentPersonaMode } from '../../../data/types'; 
import styles from './ModesSection.module.css'; 
import { ArrowRight } from 'lucide-react';

interface ModesSectionProps {
  navigateTo: (page: PageType) => void; // ADD THIS PROP
}

export const ModesSection: React.FC<ModesSectionProps> = ({ navigateTo }) => { // ACCEPT navigateTo as prop
  // const { navigateTo } = useNavigationContext(); // REMOVE THIS LINE

  // Map internal mode IDs to PageType slugs for navigation
  const modePageRoutes: Record<StudentPersonaMode, PageType> = { 
      'FEEDBACK_REVISION': 'mode-detail-corregir-feedback',
      'ARCHITECTURE_NOOB': 'mode-detail-desde-cero',
      'PRE_SUBMISSION_AUDIT': 'mode-detail-antes-de-entregar',
      'SONAR_QUALITY': 'mode-detail-buenas-practicas',
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerWrapper}>
          <h2 className={styles.headerTitle}>
            Explora Nuestros Modos
          </h2>
          <p className={styles.headerSubtitle}>
            Elige el modo que mejor se adapte a tu necesidad: desde aprender arquitectura desde cero hasta alcanzar la máxima calidad de código.
          </p>
        </div>

        {/* Modes Grid */}
        <div className={styles.modesGrid}>
          {MODES_CONFIG.map((mode) => (
            <div
              key={mode.id}
              className={`${styles.modeCard} group`} /* Added 'group' directly to JSX */
            >
              {/* Gradient Background */}
              <div
                className={`${styles.modeCardGradientBar} from-${mode.colorClass}-500 to-${mode.colorClass}-700`}
              />

              {/* Content */}
              <div className={styles.modeCardContent}>
                <h3 className={styles.modeCardTitle}>
                  {mode.title}
                </h3>
                <p className={styles.modeCardSubtitle}>
                  {mode.subtitle}
                </p>
                <p className={styles.modeCardDescription}>
                  {mode.description} {/* Use mode.description consistently */}
                </p>

                <button
                  type="button"
                  onClick={() => navigateTo(modePageRoutes[mode.id])} // No need for `as PageType`
                  className={styles.modeCardButton}
                >
                  Explorar
                  {/* Using Lucide-React ArrowRight for consistency */}
                  <ArrowRight className={styles.modeCardButtonIcon} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className={styles.footerNoteWrapper}>
          <p className={styles.footerNoteText}>
            Puedes cambiar de modo en cualquier momento desde la navegación principal
          </p>
        </div>
      </div>
    </section>
  );
};
