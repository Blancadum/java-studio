export interface MenuColumn {
  title: string;
  links: Array<{
    label: string;
    path: string;
    description?: string;
  }>;
}

export const MEGAMENU_CONFIG: MenuColumn[] = [
  {
    title: 'Auditar Código',
    links: [
      { label: 'Desde Cero', path: '/modalidades', description: 'Análisis arquitectónico' },
      { label: 'Antes de Entregar', path: '/modalidades', description: 'Validación pre-entrega' },
      { label: 'Corregir con Feedback', path: '/modalidades', description: 'Mejora con feedback' },
      { label: 'Buenas Prácticas', path: '/modalidades', description: 'Auditoría SonarQube' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Documentación', path: '/documentation', description: 'Guía de uso' },
      { label: 'Guía de Arquitectura', path: '/guide', description: 'Patrones' },
      { label: 'Contacto', path: '/contact', description: 'Soporte' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', path: '/privacy', description: 'Política de privacidad' },
      { label: 'Términos', path: '/terms', description: 'T&C' },
    ],
  },
];
