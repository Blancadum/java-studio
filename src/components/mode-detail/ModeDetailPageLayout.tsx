import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Feature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface CTA {
  primaryText?: string;
  secondaryText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

interface ModeDetailPageLayoutProps {
  readonly hero?: {
    title: string;
    subtitle: string;
    description?: string;
    onStartApp?: () => void;
  };
  readonly features?: Feature[];
  readonly howItWorks?: Step[];
  readonly faq?: FAQ[];
  readonly cta?: CTA;
  readonly onGoBack?: () => void;
  readonly onStartApp?: () => void;
}

export const ModeDetailPageLayout: React.FC<Readonly<ModeDetailPageLayoutProps>> = ({
  hero,
  features,
  howItWorks,
  faq,
  cta,
  onGoBack,
  onStartApp,
}) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      {hero && (
        <div className="relative overflow-hidden px-6 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={onGoBack}
              className="mb-8 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Volver
            </button>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
                {hero.title}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                {hero.subtitle}
              </p>
              {hero.description && (
                <p className="text-base text-slate-600 leading-relaxed">
                  {hero.description}
                </p>
              )}
            </div>

            {/* Hero CTA */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={onStartApp || hero.onStartApp}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
              >
                Comenzar Análisis
              </button>
              {onGoBack && (
                <button
                  onClick={onGoBack}
                  className="px-6 py-3 bg-white border border-slate-300 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-all"
                >
                  Ver Otros Modos
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      {features && features.length > 0 && (
        <div className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Lo que aprenderás
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all"
                >
                  {feature.icon && (
                    <div className="mb-4 text-2xl">{feature.icon}</div>
                  )}
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      {howItWorks && howItWorks.length > 0 && (
        <div className="px-6 py-12 bg-gradient-to-b from-purple-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Cómo funciona
            </h2>
            <div className="space-y-6">
              {howItWorks.map((step, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Accordion */}
      {faq && faq.length > 0 && (
        <div className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-3">
              {faq.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-purple-300 transition-colors"
                >
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === idx ? null : idx)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 text-left">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-600 transition-transform ${
                        expandedFAQ === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === idx && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                      <p className="text-slate-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      {cta && (
        <div className="px-6 py-12 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="max-w-4xl mx-auto flex gap-4 justify-center">
            {cta.onPrimaryClick && (
              <button
                onClick={cta.onPrimaryClick}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
              >
                {cta.primaryText || 'Comenzar'}
              </button>
            )}
            {cta.onSecondaryClick && (
              <button
                onClick={cta.onSecondaryClick}
                className="px-8 py-3 bg-white border border-slate-300 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-all"
              >
                {cta.secondaryText || 'Atrás'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
