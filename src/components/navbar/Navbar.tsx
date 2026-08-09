import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { UserProfile, StudentPersonaMode } from '../../data/types';
import { MODE_OPTIONS } from './navbar.constants';
import styles from './Navbar.module.css';

interface NavbarProps {
  driveConnected: boolean;
  userEmail?: string;
  userProfile?: UserProfile | null;
  activeMode: StudentPersonaMode;
  onSelectMode?: (mode: StudentPersonaMode) => void;
  onConnectDrive: () => void;
  onLoadSample: () => void;
  onReset: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  isAnalyzing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  driveConnected,
  userEmail,
  userProfile,
  activeMode,
  onSelectMode,
  onConnectDrive,
  onLoadSample,
  onReset,
  onOpenAuth,
  onOpenProfile,
  isAnalyzing,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const currentMode = MODE_OPTIONS.find(m => m.id === activeMode) ?? MODE_OPTIONS[0];

  const handleSelectMode = (id: StudentPersonaMode) => {
    onSelectMode?.(id);
    setDropdownOpen(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Brand */}
        <button
          type="button"
          className={styles.brand}
          onClick={() => scrollTo('workspace-section')}
        >
          Java Studio
        </button>

        {/* Nav */}
        <nav className={styles.nav}>

          <button
            type="button"
            className={styles.navLink}
            onClick={() => scrollTo('readme-section')}
          >
            Readme
          </button>

          {/* Mode selector */}
          <div className={styles.modeWrapper} ref={dropdownRef}>
            <button
              type="button"
              className={styles.modeTrigger}
              onClick={() => setDropdownOpen(v => !v)}
            >
              <span
                className={styles.modeDot}
                style={{ backgroundColor: currentMode.color }}
              />
              {currentMode.label}
              <ChevronDown className={`${styles.chevron} ${dropdownOpen ? styles.open : ''}`} />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                {MODE_OPTIONS.map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    className={`${styles.dropdownItem} ${activeMode === opt.id ? styles.active : ''}`}
                    onClick={() => handleSelectMode(opt.id)}
                  >
                    <span
                      className={styles.dropdownItemDot}
                      style={{ backgroundColor: opt.color }}
                    />
                    <span className={styles.dropdownItemLabel}>
                      <span className={`${styles.dropdownItemTitle} ${activeMode === opt.id ? styles.active : ''}`}>
                        {opt.label}
                      </span>
                      <span className={styles.dropdownItemDesc}>{opt.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles.navLink}
            onClick={onLoadSample}
            disabled={isAnalyzing}
          >
            Demo
          </button>

          <button
            type="button"
            className={styles.navLink}
            onClick={onConnectDrive}
          >
            {driveConnected ? (userEmail ?? 'Drive') : 'Drive'}
          </button>

        </nav>

        {/* Right */}
        <div className={styles.right}>
          <span className={styles.statusDot} title="Motor listo" />
          <button
            type="button"
            className={styles.userBtn}
            onClick={userProfile ? onOpenProfile : onOpenAuth}
          >
            {userProfile ? userProfile.name.split(' ')[0] : 'Entrar'}
          </button>
        </div>

      </div>
    </header>
  );
};
