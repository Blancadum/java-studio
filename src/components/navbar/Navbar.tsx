import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogIn, LogOut, Settings, FileText, Compass, ShieldCheck, Award, Home } from 'lucide-react';
import { UserProfile, StudentPersonaMode } from '../../data/types';
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
  onOpenAIConfig?: () => void;
  onLogout?: () => void;
  onGoHome?: () => void;
}

const SERVICES = [
  { id: 'ARCHITECTURE_NOOB' as StudentPersonaMode, label: 'Desde cero', icon: <Compass className="w-4 h-4" />, desc: 'Estructura de la lógica' },
  { id: 'PRE_SUBMISSION_AUDIT' as StudentPersonaMode, label: 'Antes de entregar', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Corrección y limpieza' },
  { id: 'FEEDBACK_REVISION' as StudentPersonaMode, label: 'Corregir con feedback', icon: <FileText className="w-4 h-4" />, desc: 'La 2nda oportunidad' },
  { id: 'SONAR_QUALITY' as StudentPersonaMode, label: 'Buenas prácticas', icon: <Award className="w-4 h-4" />, desc: 'Código profesional' },
];

export const Navbar: React.FC<NavbarProps> = ({
  driveConnected,
  userProfile,
  activeMode,
  onSelectMode,
  onConnectDrive,
  onOpenAuth,
  onOpenProfile,
  isAnalyzing,
  onOpenAIConfig,
  onLogout,
  onGoHome,
}) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectService = (mode: StudentPersonaMode) => {
    onSelectMode?.(mode);
    setServicesOpen(false);
  };

  const handleOpenProfile = () => {
    onOpenProfile?.();
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('¿Cerrar sesión?')) {
      onLogout?.();
      setProfileMenuOpen(false);
    }
  };

  const initials = userProfile?.name
    ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Brand — casita que lleva a home */}
        <button type="button" className={styles.brand} onClick={onGoHome} title="Ir a Home">
          <Home className="w-5 h-5" />
          Java Studio
        </button>

        {/* Nav central — solo si hay usuario */}
        {userProfile && (
          <nav className={styles.nav}>
            {/* Qué hacer — desplegable */}
            <div className={styles.modeWrapper} ref={servicesRef}>
              <button
                type="button"
                className={styles.modeTrigger}
                onClick={() => setServicesOpen(v => !v)}
                disabled={isAnalyzing}
              >
                Qué hacer
                <ChevronDown className={`${styles.chevron} ${servicesOpen ? styles.open : ''}`} />
              </button>

              {servicesOpen && (
                <div className={styles.dropdown}>
                  {SERVICES.map(s => (
                    <button
                      type="button"
                      key={s.id}
                      className={`${styles.dropdownItem} ${activeMode === s.id ? styles.active : ''}`}
                      onClick={() => handleSelectService(s.id)}
                    >
                      <span className="text-slate-500">{s.icon}</span>
                      <span className={styles.dropdownItemLabel}>
                        <span className={`${styles.dropdownItemTitle} ${activeMode === s.id ? styles.active : ''}`}>
                          {s.label}
                        </span>
                        <span className={styles.dropdownItemDesc}>{s.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        )}

        {/* Right */}
        <div className={styles.right}>
          {userProfile ? (
            <div className={styles.profileSection} ref={profileMenuRef}>
              <button
                type="button"
                className={styles.profileTrigger}
                onClick={() => setProfileMenuOpen(v => !v)}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <ChevronDown className={`${styles.profileChevron} ${profileMenuOpen ? styles.open : ''}`} />
              </button>

              {profileMenuOpen && (
                <div className={styles.profileDropdown}>
                  <button
                    type="button"
                    className={styles.profileDropdownItem}
                    onClick={handleOpenProfile}
                  >
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                    Mi perfil
                  </button>

                  <div className={styles.profileDropdownDivider} />

                  <button
                    type="button"
                    className={`${styles.profileDropdownItem} ${styles.logout}`}
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className={styles.userBtn} onClick={onOpenAuth}>
              <LogIn className="w-4 h-4" />
              Acceder
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
