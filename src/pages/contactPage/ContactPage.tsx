import React from 'react';
import { ContactInfo } from '../../components/contact/ContactInfo';
import { ContactForm } from '../../components/contact/ContactForm';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/common/PageHeader';


export function ContactPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Contacto"
        subtitle="¿Preguntas, sugerencias o reportes? Nos encantaría escucharte."
      />
      
      <div className={styles.contactGrid}>
        <ContactInfo />
        <ContactForm />
      </div>
    </PageContainer>
  );
}