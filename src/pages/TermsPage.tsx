import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { getLegalContent } from '../data/app-content'; // Import legal content from app-content
import { LegalSection } from '../components/common/LegalSection'; // Import LegalSection

export function TermsPage() {
  const termsContent = getLegalContent()['terms-of-service'];

  if (!termsContent) {
    return (
      <PageContainer size="large">
        <p className="text-red-500">Contenido de términos de servicio no encontrado.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="large">
      <PageHeader
        title={termsContent.title}
        subtitle={`Última actualización: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      <div className="prose prose-invert max-w-none text-gray-800 space-y-6"> {/* Keep prose for general typography */}
        {termsContent.sections.map((section, index) => (
          <LegalSection key={index} title={section.title}>{section.content}</LegalSection>
        ))}
      </div>
    </PageContainer>
  );
}
