import { ModeDetailPageLayout } from '../../components/mode-detail/ModeDetailPageLayout';
import { modeDetailBuenasPracticasContent } from '../../data/mode-detail-content/buenasPracticas';

interface ModeDetailPageProps {
  readonly onGoBack?: () => void;
  readonly onStartApp?: () => void;
}

export function ModeDetailBuenasPracticasPage({ onGoBack, onStartApp }: Readonly<ModeDetailPageProps>) {
  return (
    <ModeDetailPageLayout
      hero={{ ...modeDetailBuenasPracticasContent.hero, onStartApp }}
      features={modeDetailBuenasPracticasContent.features}
      howItWorks={modeDetailBuenasPracticasContent.howItWorks}
      faq={modeDetailBuenasPracticasContent.faq}
      cta={{ ...modeDetailBuenasPracticasContent.cta, onPrimaryClick: onStartApp, onSecondaryClick: onGoBack }}
    />
  );
}
