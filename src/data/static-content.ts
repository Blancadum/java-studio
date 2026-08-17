import React from 'react';

/**
 * Contenido estático consolidado de Java Studio
 * ÚNICA FUENTE DE VERDAD para blog, docs y contenido legal
 * 
 * Consolidación de:
 * - app-content.tsx (6 docs legales completos)
 * - app-static-content.tsx (4 docs legales, incompleto)
 * 
 * Resultado: static-content.ts (completo, centralizado)
 */

export const getBlogArticles = (): Record<string, { title: string; category: string; content: React.ReactNode }> => ({
  '38-to-98': {
    title: 'Caso de Estudio: De un 3.8 a un 9.8 en Java II',
    category: 'Blog Académico · Refactorización',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p className="font-serif italic text-base text-purple-900 bg-purple-50 p-3.5 rounded-xl border border-purple-200">
          "El profesor suspendió la primera entrega porque todo estaba dentro del método main() y las variables tenían nombres genéricos como x1, a y temp."
        </p>
        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
          Las 3 claves de la refactorización
        </h4>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Encapsulamiento e Inmutabilidad:</strong> Convertir campos públicos a privados con getters/setters y validar invariantes en el constructor.
          </li>
          <li>
            <strong>Interfaces y Polimorfismo:</strong> Separar la lógica de negocio de la entrada/salida creando interfaces claras para los repositorios y servicios.
          </li>
          <li>
            <strong>Reducción de Complejidad SonarQube (S3776):</strong> Reemplazar bucles anidados de 4 niveles por métodos auxiliares privados y Streams bien documentados.
          </li>
        </ol>
        <p className="text-xs font-mono text-slate-500 pt-2">
          Escrito por Fullstack Web Dev Lovers.
        </p>
      </div>
    )
  },
  'sonarqube-s3776': {
    title: 'Cómo superar la regla SonarQube S3776 de Complejidad Cognitiva',
    category: 'Blog Académico · Calidad de Código',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p>
          La regla <strong>S3776 de SonarQube</strong> mide la dificultad humana para leer y entender un método. Cuando la complejidad supera 15 puntos, SonarQube marca el código como fallo grave.
        </p>
        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
          Solución Quirúrgica
        </h4>
        <p>
          Usa cláusulas de guarda (<em>early exit</em>) para retornar inmediatamente cuando las condiciones no se cumplan, eliminando los bloques <code>if / else</code> anidados profundamente.
        </p>
        <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
          <code>{`// ANTES (Complejidad Cognitive = 18)\nif (usuario != null) {\n  if (usuario.isActivo()) {\n    if (pedido != null) {\n      // procesar...\n    }\n  }\n}\n\n// DESPUÉS (Complejidad Cognitive = 3)\nif (usuario == null || !usuario.isActivo() || pedido == null) return;\n// procesar directamente...`}</code>
        </div>
      </div>
    )
  },
  'anti-ai-cleanup': {
    title: 'Guía Anti-Plagio IA: Limpieza Quirúrgica de Comentarios de ChatGPT',
    category: 'Blog Académico · Auditoría Anti-IA',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p>
          Muchos profesores utilizan detectores de código generado por IA que buscan marcas de agua textuales típicas de ChatGPT y Copilot como:
        </p>
        <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-rose-700">
          <li><code>// Here is the implementation of the requested method</code></li>
          <li><code>// Note: Remember to handle NullPointerException</code></li>
          <li><code>// Created by OpenAI ChatGPT</code></li>
        </ul>
        <p>
          El motor de auditoría de Java Studio elimina automáticamente estas firmas manteniendo intactos tus comentarios Javadoc legítimos.
        </p>
      </div>
    )
  },
  'solid-university': {
    title: 'Principios SOLID aplicados a Exámenes Universitarios',
    category: 'Blog Académico · Arquitectura',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p>
          Aplicar SOLID en un examen de Java II no requiere cientos de clases. Basta con respetar el principio de Responsabilidad Única (SRP) en cada clase y asegurar que las clases dependan de abstracciones (interfaces) y no de implementaciones concretas.
        </p>
      </div>
    )
  }
});

export const getDocsContent = (): Record<string, { title: string; category: string; content: React.ReactNode }> => ({
  'rubrica-java2': {
    title: 'Guía de Evaluación y Rúbricas de Java II',
    category: 'Documentación Oficial · Rúbrica Universitaria',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p>
          Documento guía sobre los criterios habituales de corrección en asignaturas universitarias de Programación II / Java II:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Estructura de Paquetes:</strong> Separación en <code>model</code>, <code>service</code>, <code>repository</code> y <code>exception</code>.</li>
          <li><strong>Tratamiento de Excepciones:</strong> Creación de excepciones personalizadas heredando de <code>RuntimeException</code>.</li>
          <li><strong>Pruebas JUnit 5:</strong> Cobertura mínima del 80% en clases del paquete service.</li>
        </ul>
      </div>
    )
  },
  'junit5-cheat': {
    title: 'JUnit 5 & Cobertura de Pruebas Unitarias',
    category: 'Documentación Técnica · Testing',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p>
          Ejemplos de assertions de JUnit 5 para validar comportamientos esperados en clases Java:
        </p>
        <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
          <code>{`@Test\n@DisplayName("Debe lanzar excepcion cuando el saldo es insuficiente")\nvoid testSaldoInsuficiente() {\n  assertThrows(SaldoInsuficienteException.class, () -> {\n    cuenta.retirar(1000.0);\n  });\n}`}</code>
        </div>
      </div>
    )
  }
});

export const getLegalContent = (): Record<string, { title: string; category: string; content: React.ReactNode }> => ({
  'privacy-policy': {
    title: 'Política de Privacidad',
    category: 'Aspectos Legales · Requerido por Google API',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p className="font-semibold text-slate-900">
          Última actualización: 8 de Agosto de 2026.
        </p>
        <p>
          En <strong>Java Studio</strong> (impulsado por la comunidad <strong>Fullstack Web Dev Lovers</strong> - <a href="https://fullstack-dev-lovers.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-pink-600 font-bold hover:underline">fullstack-dev-lovers.vercel.app</a>), nos tomamos muy en serio la privacidad de nuestros usuarios y estudiantes universitarios.
        </p>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          1. Recopilación de Datos y Permisos de Google API
        </h4>
        <p>
          Nuestra aplicación utiliza la API de Google Drive (alcance <code>https://www.googleapis.com/auth/drive.readonly</code>) únicamente para permitir a los estudiantes seleccionar proyectos Java, archivos <code>.java</code> o comprimidos <code>.zip</code> almacenados en su Google Drive.
        </p>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          2. Requisitos de Uso Limitado de la API de Google (Google Limited Use Disclosure)
        </h4>
        <p className="bg-purple-50 p-3.5 rounded-xl border border-purple-200 text-purple-900 font-mono text-xs leading-normal">
          El uso y la transferencia a cualquier otra aplicación de la información recibida de las API de Google se adherirán a la <strong>Política de Datos de Usuario de los Servicios de API de Google (Google API Service User Data Policy)</strong>, incluidos los requisitos de <strong>Uso Limitado (Limited Use Requirements)</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>No compartimos, vendemos ni alquilamos datos de usuarios a ningún tercero.</li>
          <li>No utilizamos los datos obtenidos de Google Drive para entrenar modelos de inteligencia artificial públicos ni comerciales.</li>
          <li>El procesamiento de código Java se realiza estrictamente durante la sesión activa del usuario para generar diagnósticos de rúbrica y SonarQube S3776.</li>
        </ul>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          3. Almacenamiento Local y Cookies
        </h4>
        <p>
          No almacenamos tus códigos en bases de datos remotas sin tu consentimiento expreso. El estado de la sesión y las preferencias de análisis se guardan exclusivamente en el almacenamiento local de tu navegador (<code>localStorage</code>).
        </p>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          4. Derechos de los Usuarios (GDPR / ARCO)
        </h4>
        <p>
          Tienes derecho a revocar el acceso a tu cuenta de Google en cualquier momento desde la configuración de seguridad de tu cuenta de Google. Puedes eliminar todos tus datos guardados en el navegador haciendo clic en "Nuevo Análisis" en la barra superior.
        </p>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          5. Contacto y Comunidad
        </h4>
        <p>
          Para consultas relacionadas con la privacidad, contáctanos a través de la comunidad en <a href="https://fullstack-dev-lovers.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-bold hover:underline">https://fullstack-dev-lovers.vercel.app/</a>.
        </p>
      </div>
    )
  },
  'terms-of-service': {
    title: 'Términos de Servicio',
    category: 'Aspectos Legales · Condiciones de Uso',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p className="font-semibold text-slate-900">
          Bienvenido a Java Studio por Fullstack Web Dev Lovers.
        </p>
        <p>
          Al utilizar esta plataforma, aceptas cumplir con los siguientes Términos de Servicio académicos y legales.
        </p>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          1. Propósito Educativo
        </h4>
        <p>
          Java Studio es una herramienta de tutoría y auditoría de código orientada al aprendizaje de Java II, Programación Orientada a Objetos (POO), arquitectura de software y reglas de calidad como SonarQube S3776.
        </p>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          2. Propiedad Intelectual del Código
        </h4>
        <p>
          El código fuente subido y las correcciones resultantes son propiedad exclusiva del estudiante. Java Studio no reclama derechos de autor sobre las entregas del usuario.
        </p>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          3. Responsabilidad del Estudiante
        </h4>
        <p>
          El estudiante es responsable de revisar y comprender el código generado antes de presentarlo en sus evaluaciones universitarias. La plataforma promueve el aprendizaje genuino y la erradicación de malas prácticas.
        </p>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          4. Comunidad y Enlaces
        </h4>
        <p>
          Esta plataforma enlaza a <a href="https://fullstack-dev-lovers.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-pink-600 font-bold hover:underline">Fullstack Web Dev Lovers</a> para dar soporte a la comunidad de desarrolladores de software.
        </p>
      </div>
    )
  },
  'cookie-policy': {
    title: 'Política de Cookies y Almacenamiento Local',
    category: 'Aspectos Legales · Cookies',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p>
          Esta plataforma utiliza tecnologías de almacenamiento web estándar para garantizar el correcto funcionamiento del copiloto.
        </p>
        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          1. Cookies Técnicas e Imprescindibles
        </h4>
        <p>
          Utilizamos tokens de sesión temporales gestionados por el SDK oficial de Google Auth para mantener la conexión segura con Google Drive cuando el usuario autoriza la lectura de sus archivos.
        </p>
        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          2. Almacenamiento Local (Local Storage)
        </h4>
        <p>
          Guardamos en tu navegador:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Preferencias del modelo de IA seleccionado (Gemini / Claude / OpenAI).</li>
          <li>Historial local de análisis de entregas para que no pierdas tu trabajo al refrescar.</li>
          <li>Modo de trabajo seleccionado (Subsanación, Guía POO, Pre-entrega, SonarQube).</li>
        </ul>
        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          3. Sin Cookies de Rastreo Comercial
        </h4>
        <p>
          No utilizamos cookies de publicidad dirigida, píxeles de redes sociales ni rastreadores entre sitios.
        </p>
      </div>
    )
  },
  'google-data-policy': {
    title: 'Declaración de Uso de Datos de Usuario de Google',
    category: 'Obligatorio para Verificación OAuth de Google Workspace',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <div className="p-4 rounded-xl bg-pink-50 border border-pink-200 text-pink-950 font-mono text-xs">
          <strong>Declaración Transparente de Permisos de Google:</strong>
          <p className="mt-1">
            Java Studio accede a los datos de la cuenta de Google únicamente previa solicitud explícita del usuario mediante la ventana oficial de autenticación de Google.
          </p>
        </div>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          Alcance de Permisos Solicitados
        </h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <code>https://www.googleapis.com/auth/drive.readonly</code>: Permite abrir el selector de archivos oficial de Google Drive (Google Picker) para seleccionar carpetas con código Java de tareas.
          </li>
          <li>
            <code>email</code> & <code>profile</code>: Muestra el correo del alumno en la barra superior para confirmar qué cuenta está conectada.
          </li>
        </ul>

        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1 mt-4">
          Cumplimiento Estricto de Limited Use
        </h4>
        <p>
          Confirmamos solemnemente que la aplicación cumple en su totalidad con las políticas de datos de usuario de las API de Google, incluyendo la regla de Uso Limitado. Los datos del usuario nunca se transfieren a terceros ni se usan para publicidad o entrenamiento de modelos de lenguaje generalistas.
        </p>
      </div>
    )
  },
  'legal-notice': {
    title: 'Aviso Legal y Propiedad Intelectual',
    category: 'Aspectos Legales · Derechos de Autor',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p>
          <strong>Java Studio</strong> es un copiloto académico desarrollado para la comunidad <strong>Fullstack Web Dev Lovers</strong> (<a href="https://fullstack-dev-lovers.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-pink-600 font-bold hover:underline">fullstack-dev-lovers.vercel.app</a>).
        </p>
        <p>
          Marcas registradas como Java, Oracle, Google, SonarQube, JUnit y GitHub pertenecen a sus respectivos propietarios y se citan únicamente con fines descriptivos e ilustrativos para la formación técnica en ingeniería de software.
        </p>
      </div>
    )
  }
});
