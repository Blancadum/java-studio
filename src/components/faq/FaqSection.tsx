import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { FaqItem } from '../../data/faq-content/faq';

export interface FaqSectionProps {
  title: string;
  faqs: FaqItem[];
  onOpenTutorWithQuery?: (query: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  title,
  faqs,
  onOpenTutorWithQuery,
}) => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between gap-8">
          <div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
              ▪ Preguntas Frecuentes
            </div>
            <h2 className="text-4xl font-bold text-black mb-2">{title}</h2>
          </div>
          {onOpenTutorWithQuery && (
            <button
              onClick={() =>
                onOpenTutorWithQuery('Tengo dudas sobre cómo funciona Java Studio')
              }
              className="text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-2 whitespace-nowrap mt-2"
            >
              <i className="ti ti-robot"></i>
              Preguntar a Profe Virtual
            </button>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.question} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
              <button
                type="button"
                onClick={() =>
                  setExpandedFaq(expandedFaq === faq.question ? null : faq.question)
                }
                className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-left">
                  <span className="text-sm font-semibold text-gray-500 mr-3">
                    {faqs.indexOf(faq) + 1}
                  </span>
                  <span className="font-semibold text-black">
                    {faq.question}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform',
                    expandedFaq === faq.question && 'rotate-180 text-sky-700'
                  )}
                />
              </button>

              {expandedFaq === faq.question && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
