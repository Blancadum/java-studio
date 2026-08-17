import React from 'react';
import { HeroSection } from '../components/landing/heroSection/HeroSection';
import { ModesSection } from '../components/landing/modesSection/ModesSection';
import { FinalCtaSection } from '../components/landing/finalCta/FinalCtaSection';
import { FaqSection } from '../components/faq/FaqSection';
import { Footer } from '../components/footer/Footer';
import { ALL_FAQS } from '../data/faq-content/faq';
import { PrinciplesSection } from '../components/landing/principles/PrinciplesSection'; // Keep this import
import { UserProfile, PageType } from '../data/types';

interface LandingPageProps {
  userProfile?: UserProfile | null;
  onLoadSample: () => void;
  onOpenAuth?: () => void;
  onNavigateTo: (page: PageType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = (props) => {
  return (
    <div className="w-full bg-white text-black overflow-hidden"> {/* Keep this div */}
      <HeroSection onOpenAuth={props.onOpenAuth} navigateTo={props.onNavigateTo} userProfile={props.userProfile} /> {/* Keep this */}
      <ModesSection navigateTo={props.onNavigateTo} /> {/* Pass navigateTo to ModesSection */}
      <PrinciplesSection /> {/* Keep this */}
      <FinalCtaSection onLoadSample={props.onLoadSample} onOpenAuth={props.onOpenAuth} /> {/* Keep this */}
      <FaqSection title="Preguntas Frecuentes" faqs={ALL_FAQS.home} />
      <Footer onNavigate={props.onNavigateTo} /> {/* Simplificado: Pasar onNavigateTo directamente */}
    </div>
  );
};
