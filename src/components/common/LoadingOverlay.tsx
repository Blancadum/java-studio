import React from 'react';
import { Loader2 } from 'lucide-react';
import { StudentPersonaMode } from '../../data/types';
import styles from './LoadingOverlay.module.css'; // Importar CSS Module

interface LoadingOverlayProps {
  activeMode: StudentPersonaMode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ activeMode }) => {
  return (
    <div className={styles.loadingOverlay} aria-live="polite" aria-busy="true">
      <div className={styles.spinnerContainer}>
        <Loader2 className={styles.spinnerIcon} />
      </div>
      <h3 className={styles.title}>
        Ejecutando Inteligencia Artificial en Modo: <span className={styles.modeText}>{activeMode}</span>
      </h3>
      <p className={styles.description}>
        Analizando estructura de clases Java, aplicando rúbrica universitaria y generando recomendaciones en código.
      </p>
    </div>
  );
};