import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { getLegalContent } from '../data/app-content'; 
import { LegalSection } from '../components/common/LegalSection'; // Import LegalSection

export function PrivacyPage() {
  const privacyContent = getLegalContent()['privacy-policy'];

  if (!privacyContent) {
    return (
      <PageContainer size="large">
        <p className="text-red-500">Contenido de política de privacidad no encontrado.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="large">
      <PageHeader
        title={privacyContent.title}
        subtitle={`Última actualización: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      <div className="prose prose-invert max-w-none text-gray-800 space-y-6">
        {privacyContent.sections.map((section) => (
          <LegalSection key={section.title} title={section.title}>{section.content}</LegalSection>
        ))}
      </div>
    </PageContainer>
  );
}
