import React from 'react';
import { Sparkles, ExternalLink, Globe } from 'lucide-react';
import { Reveal } from '../../reveal/Reveal';
import { ChipButton } from '../../chipbutton/ChipButton';

import styles from './FinalCtaSection.module.css'; // Import CSS Module
interface FinalCtaSectionProps {
  onLoadSample: () => void;
  onOpenAuth?: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onLoadSample, onOpenAuth }) => {
  return (
    <section className={styles.finalCtaSection}>
      <Reveal delay={0}>
        <div className={styles.finalCtaBadge}> {/* Apply module class */}
          <Sparkles className={styles.finalCtaBadgeIcon} /> {/* Apply module class */}
          <span>Impulsado por Fullstack Web Dev Lovers</span>
        </div>
        <h2 className={styles.finalCtaTitle}> {/* Apply module class */}
          ¿Listo para explorar los 4 Modos Académicos?
        </h2>
        <p className={styles.finalCtaSubtitle}> {/* Apply module class */}
          Elige el modo que mejor se adapte a tu necesidad actual.
        </p>
        <div className={styles.finalCtaActions}> {/* Apply module class */}
          <ChipButton variant="yellow" onClick={onOpenAuth}>
            Probar Demo Gratis
          </ChipButton>
          <a href="https://fullstack-dev-lovers.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.communityLink}> {/* Apply module class */}
            <Globe className={styles.communityLinkIcon} /> {/* Apply module class */}
            <span>Fullstack Web Dev Lovers <ExternalLink className={styles.communityLinkExternalIcon} /></span> {/* Apply module class */}
          </a>
        </div>
      </Reveal>
    </section>
  );
};