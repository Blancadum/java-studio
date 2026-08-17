import { ModeDetailPageLayout } from '../../components/mode-detail/ModeDetailPageLayout';
import { modeDetailAntesDeEntregarContent } from '../../data/mode-detail-content/antesDeEntregar';

interface ModeDetailPageProps {
  readonly onGoBack?: () => void;
  readonly onStartApp?: () => void;
}

export function ModeDetailAntesDeEntregarPage({ onGoBack, onStartApp }: Readonly<ModeDetailPageProps>) {
  return (
    <ModeDetailPageLayout
      hero={{ ...modeDetailAntesDeEntregarContent.hero, onStartApp }}
      features={modeDetailAntesDeEntregarContent.features}
      howItWorks={modeDetailAntesDeEntregarContent.howItWorks}
      faq={modeDetailAntesDeEntregarContent.faq}
      cta={{ ...modeDetailAntesDeEntregarContent.cta, onPrimaryClick: onStartApp, onSecondaryClick: onGoBack }}
    />
  );
}
