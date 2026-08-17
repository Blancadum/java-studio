import React from 'react';
import { X } from 'lucide-react';
import { MEGAMENU_CONFIG } from './megaMenuConfig';
import styles from './MegaMenu.module.css';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  const handleClick = (path: string) => {
    if (onNavigate) onNavigate(path);
    onClose();
  };

  return (
    <div className={styles.megaMenu} onClick={onClose}>
      <div className={styles.megaMenuContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.megaMenuGrid}>
          {MEGAMENU_CONFIG.map((col, idx) => (
            <div key={idx} className={styles.menuColumn}>
              <h3 className={styles.columnTitle}>{col.title}</h3>
              <nav className={styles.linksList}>
                {col.links.map((link, i) => (
                  <a key={i} href="#" onClick={(e) => { e.preventDefault(); handleClick(link.path); }} className={styles.menuLink}>
                    <div className={styles.menuLinkText}>{link.label}</div>
                    {link.description && <div className={styles.menuLinkDesc}>{link.description}</div>}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className={styles.megaMenuFooter}>
          <span className="text-sm text-slate-600">© 2026 Java Studio</span>
          <button onClick={onClose} className={styles.closeButton}><X className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};
