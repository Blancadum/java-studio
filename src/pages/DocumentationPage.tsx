import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { getDocsContent } from '../data/app-content'; // Changed to app-content as static-content was not provided and app-content has similar structure
import DocArticle from '../components/common/DocArticle'; // Assuming DocArticle is a default export

export function DocumentationPage() {
  return (
    <PageContainer size="large">
      <PageHeader
        title="Documentación"
        subtitle="Guías, tutoriales y preguntas frecuentes para aprovechar al máximo Java Studio."
      />
      <section className="space-y-8">
        {Object.values(getDocsContent()).map((section) => (
          <DocArticle key={section.title} title={section.title} content={section.content} />
        ))}
      </section>
    </PageContainer>
  );
}
