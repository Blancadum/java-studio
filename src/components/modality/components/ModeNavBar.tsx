import React from 'react';
import { Sparkles } from 'lucide-react';
import { MODES_CONFIG } from '../../data/modes';
import { StudentPersonaMode } from '../../data/types';

interface ModeNavBarProps {
  activeMode: StudentPersonaMode;
  onSelectMode: (mode: StudentPersonaMode) => void;
  onLoadSample: () => void;
  showLoadSample?: boolean;
}

export const ModeNavBar: React.FC<ModeNavBarProps> = ({ activeMode, onSelectMode, onLoadSample, showLoadSample = false }) => {
  return (
    <div className={styles.modeNavBar}>
      <div className={styles.modeNavGrid}>
        {MODES_CONFIG.map(m => (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={`${styles.modeNavButton} ${
              activeMode === m.id
                ? styles.active
                : styles.inactive
            }`}
          >
            <span className={styles.modeNavButtonTitle}>{m.title}</span>
          </button>
        ))}
      </div>

      {showLoadSample && (
        <button onClick={onLoadSample} className={styles.loadDemoButton}>
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Cargar Demo</span>
        </button>
      )}
    </div>
  );
};