import { ModeDetailPageLayout } from '../../components/mode-detail/ModeDetailPageLayout';
import { modeDetailCorregirFeedbackContent } from '../../data/mode-detail-content/corregirFeedback';

interface ModeDetailPageProps {
  readonly onGoBack?: () => void;
  readonly onStartApp?: () => void;
}

export function ModeDetailCorregirFeedbackPage({ onGoBack, onStartApp }: Readonly<ModeDetailPageProps>) {
  return (
    <ModeDetailPageLayout
      hero={{ ...modeDetailCorregirFeedbackContent.hero, onStartApp }}
      features={modeDetailCorregirFeedbackContent.features}
      howItWorks={modeDetailCorregirFeedbackContent.howItWorks}
      faq={modeDetailCorregirFeedbackContent.faq}
      cta={{ ...modeDetailCorregirFeedbackContent.cta, onPrimaryClick: onStartApp, onSecondaryClick: onGoBack }}
    />
  );
}
