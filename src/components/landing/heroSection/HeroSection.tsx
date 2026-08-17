import React from 'react';
import { ArrowRight, Bot } from 'lucide-react';
import { UserProfile, PageType } from '../../../data/types'; // Import PageType from types.ts
import styles from './HeroSection.module.css'; // Import CSS Module

interface HeroSectionProps {
  onOpenAuth?: () => void;
  navigateTo: (page: PageType) => void;
  userProfile?: UserProfile | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth, navigateTo, userProfile }) => {
  const handlePrimaryCtaClick = () => {
    if (userProfile) {
      // navigateTo('campus');
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Badge */}
        <div className={styles.badge}>
          <Bot className={styles.badgeIcon} />
          <span>Copiloto Académico para Java II</span>
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          De la duda al código, y del código al{' '}
          <span className={styles.titleHighlight}>
            aprobado
          </span>
          .
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Analiza tu proyecto de Java II con IA, compara tu código con el feedback de tu profe y recibe sugerencias para mejorar tu nota.
        </p>

        {/* CTA Button */}
        <div className={styles.ctaWrapper}>
          <button
            type="button"
            onClick={handlePrimaryCtaClick}
            className={styles.ctaButton}
          >
            {userProfile ? 'Ir al Campus' : 'Empezar Gratis'}
            <ArrowRight className={styles.ctaIcon} />
          </button>
        </div>
      </div>
    </section>
  );
};
