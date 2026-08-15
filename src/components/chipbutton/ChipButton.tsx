import React from 'react';
import styles from './ChipButton.module.css';

export const ChipButton: React.FC<{
  children: React.ReactNode;
  variant?: 'solid' | 'ghost' | 'yellow' | 'blue' | 'zen';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ children, variant = 'solid', onClick, className = '', disabled = false }) => {
  
  const variantClass = styles[variant] || styles.solid;

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${styles.base} ${variantClass} ${className}`}>
      {children}
    </button>
  );
};