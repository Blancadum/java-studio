import React from 'react';
import { FileText, Compass, ShieldCheck, Award } from 'lucide-react';
import { StudentPersonaMode } from './types';

export const MODES_CONFIG: {
  id: StudentPersonaMode;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'FEEDBACK_REVISION',
    num: '001',
    title: 'Track / Subsanación Feedback',
    subtitle: 'Post-Suspenso & Comparativa AST',
    desc: 'Compara tu borrador o entrega inicial contra las observaciones de tu profesora o las correcciones. Detecta discrepancias de firmas, visibilidad y cumplimiento de rúbrica.',
    icon: <FileText className="w-5 h-5 text-amber-600" />,
  },
  {
    id: 'ARCHITECTURE_NOOB',
    num: '002',
    title: 'Model / Guía POO (Enunciados)',
    subtitle: 'Iniciación & Cero Parálisis',
    desc: 'Desglosa enunciados complejos de examen o prácticas en esqueletos POO con clases, atributos privados, interfaces y marcas // TODO para programar autónomamente.',
    icon: <Compass className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: 'PRE_SUBMISSION_AUDIT',
    num: '003',
    title: 'Report / Pre-Entrega & Anti-IA',
    subtitle: 'Higiene de Proyecto & Rúbrica',
    desc: 'Sube tu .ZIP antes de entregar. Purga carpetas temporales de IDE (.idea, target), desinfecta comentarios con huellas delatadoras de IA y valida tu score académico.',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: 'SONAR_QUALITY',
    num: '004',
    title: 'Act / SonarQube & SOLID',
    subtitle: 'Calidad Industrial & JUnit 5',
    desc: 'Mide la Complejidad Cognitiva (S3776 < 15), elimina duplicaciones, valida principios SOLID y autogenera suites completas de pruebas unitarias con JUnit 5.',
    icon: <Award className="w-5 h-5 text-sky-600" />,
  }
];

export const FAQ_DATA = [
  {
    q: '¿Cómo garantiza Java Studio que el código refactorizado respete mi trabajo original?',
    a: 'El motor respeta la estructura y nombres de variables originales de tu entrega o borrador aplicando cambios quirúrgicos únicamente en las firmas y patrones requeridos por la rúbrica del profesor.'
  },
  {
    q: '¿Qué hago si no tengo el código corregido sino sólo un documento PDF con comentarios?',
    a: 'Puedes pegar directamente los comentarios de tu profesora en el cuadro de texto. La IA interpretará las correcciones solicitadas y adaptará tu código.'
  },
  {
    q: '¿Puedo descargar las clases corregidas y los tests JUnit 5 en un archivo .ZIP?',
    a: 'Sí, una vez finalizado el análisis podrás descargar todos los parches y archivos .java listos para empaquetar y entregar.'
  }
];

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
          <li><strong>Encapsulamiento e Inmutabilidad:</strong> Convertir campos públicos a privados con getters/setters y validar invariantes en el constructor.</li>
          <li><strong>Interfaces y Polimorfismo:</strong> Separar la lógica de negocio de la entrada/salida creando interfaces claras para los repositorios y servicios.</li>
          <li><strong>Reducción de Complejidad SonarQube (S3776):</strong> Reemplazar bucles anidados de 4 niveles por métodos auxiliares privados y Streams bien documentados.</li>
        </ol>
        <p className="text-xs font-mono text-slate-500 pt-2">Escrito por Fullstack Web Dev Lovers.</p>
      </div>
    )
  },
  'sonarqube-s3776': {
    title: 'Cómo superar la regla SonarQube S3776 de Complejidad Cognitiva',
    category: 'Blog Académico · Calidad de Código',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p>La regla <strong>S3776 de SonarQube</strong> mide la dificultad humana para leer y entender un método. Cuando la complejidad supera 15 puntos, SonarQube marca el código como fallo grave.</p>
        <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">Solución Quirúrgica</h4>
        <p>Usa cláusulas de guarda (<em>early exit</em>) para retornar inmediatamente cuando las condiciones no se cumplan, eliminando los bloques <code>if / else</code> anidados profundamente.</p>
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
        <p>Muchos profesores utilizan detectores de código generado por IA que buscan marcas de agua textuales típicas de ChatGPT y Copilot como:</p>
        <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-rose-700">
          <li><code>// Here is the implementation of the requested method</code></li>
          <li><code>// Note: Remember to handle NullPointerException</code></li>
          <li><code>// Created by OpenAI ChatGPT</code></li>
        </ul>
        <p>El motor de auditoría de Java Studio elimina automáticamente estas firmas manteniendo intactos tus comentarios Javadoc legítimos.</p>
      </div>
    )
  },
  'solid-university': {
    title: 'Principios SOLID aplicados a Exámenes Universitarios',
    category: 'Blog Académico · Arquitectura',
    content: (
      <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
        <p>Aplicar SOLID en un examen de Java II no requiere cientos de clases. Basta con respetar el principio de Responsabilidad Única (SRP) en cada clase y asegurar que las clases dependan de abstracciones (interfaces) y no de implementaciones concretas.</p>
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
        <p>Documento guía sobre los criterios habituales de corrección en asignaturas universitarias de Programación II / Java II:</p>
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
        <p>Ejemplos de assertions de JUnit 5 para validar comportamientos esperados en clases Java:</p>
        <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
          <code>{`@Test\n@DisplayName("Debe lanzar excepcion cuando el saldo es insuficiente")\nvoid testSaldoInsuficiente() {\n  assertThrows(SaldoInsuficienteException.class, () -> {\n    cuenta.retirar(1000.0);\n  });\n}`}</code>
        </div>
      </div>
    )
  }
});