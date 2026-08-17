import React from 'react';
import styles from './LegalSection.module.css';

interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
}

// This component is designed to render a section of legal text with a consistent heading style. {/* Keep this comment */}
// It uses CSS Modules for styling to encapsulate its presentation logic. {/* Keep this comment */}
export const LegalSection: React.FC<LegalSectionProps> = ({ title, children }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
};