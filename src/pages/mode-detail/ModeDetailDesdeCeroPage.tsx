import { ModeDetailPageLayout } from '../../components/mode-detail/ModeDetailPageLayout';
import { modeDetailDesdeCeroContent } from '../../data/mode-detail-content/desdeCero';

interface ModeDetailPageProps {
  readonly onGoBack?: () => void;
  readonly onStartApp?: () => void;
}

export function ModeDetailDesdeCeroPage({ onGoBack, onStartApp }: Readonly<ModeDetailPageProps>) {
  return (
    <ModeDetailPageLayout
      hero={{ ...modeDetailDesdeCeroContent.hero, onStartApp }}
      features={modeDetailDesdeCeroContent.features}
      howItWorks={modeDetailDesdeCeroContent.howItWorks}
      faq={modeDetailDesdeCeroContent.faq}
      cta={{ ...modeDetailDesdeCeroContent.cta, onPrimaryClick: onStartApp, onSecondaryClick: onGoBack }}
    />
  );
}
