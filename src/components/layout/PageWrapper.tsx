import React from 'react';
import { UserProfile } from '../../data/types'; 
import { ALL_FAQS } from '../../data/faq-content/faq'; 
import { HeroSection } from '../landing/heroSection/HeroSection';
import { ModesSection } from '../landing/modesSection/ModesSection';
import { FinalCtaSection } from '../landing/finalCta/FinalCtaSection';
import { PrinciplesSection } from '../landing/principles/PrinciplesSection';
import { FaqSection } from '../faq/FaqSection';
import { Footer } from '../footer/Footer';
/**
 * PageWrapper es el contenedor de la página de landing (marketing).
 * Compone todos los sections del landing en el orden correcto.
 * 
 * NOTA: Esta es la versión ÚNICA y centralizada del landing.
 * Cualquier otro componente que necesite el landing debe usar este.
 */
interface PageWrapperProps { // Simplified props for a pure landing page wrapper
  userProfile?: UserProfile | null; // Needed for HeroSection
  onLoadSample: () => void; // Needed for FinalCtaSection
  onOpenAuth?: () => void; // Needed for HeroSection and FinalCtaSection
  onNavigateTo: (path: string) => void; // Needed for HeroSection and Footer
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  onLoadSample,
  onOpenAuth,
  onNavigateTo,
  userProfile,
}) => {
  return (
    <div className="w-full bg-white text-black overflow-hidden">
      <HeroSection
        onOpenAuth={onOpenAuth}
        navigateTo={onNavigateTo} // Pass navigateTo
        userProfile={userProfile} // Pass userProfile
      />
      <ModesSection
        navigateTo={onNavigateTo} // Pass navigateTo as prop
      />
      <PrinciplesSection />
      <FinalCtaSection
        onLoadSample={onLoadSample}
        onOpenAuth={onOpenAuth}
      />
      <FaqSection
        title="Preguntas Frecuentes"
        faqs={ALL_FAQS.home}
      />
      <Footer onNavigate={onNavigateTo} /> {/* Simplificado: Pasar onNavigateTo directamente */}
    </div>
  );
};
