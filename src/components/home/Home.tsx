import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Compass,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Upload,
  HardDrive,
  Code2,
  ChevronDown,
  ChevronUp,
  Zap,
  Bot,
  Settings2,
  FileCode,
  BookOpen,
  GraduationCap,
  Star,
  ExternalLink,
  Terminal,
  X,
  Heart,
  Scale,
  Globe
} from 'lucide-react';
import JSZip from 'jszip';
import { JavaFile, StudentPersonaMode } from '../../data/types';
import { Reveal } from '../Reveal/Reveal';
import { ChipButton } from '../ChipButton/ChipButton';
import styles from './Home.module.css';

interface HomeProps {
  activeMode: StudentPersonaMode;
  onSelectMode: (mode: StudentPersonaMode) => void;
  onStartAnalysis: (
    noFiles: JavaFile[],
    fixedFiles: JavaFile[],
    teacherDocContent: string,
    modeSpecificOptions: any
  ) => void;
  onOpenDriveModal: () => void;
  onLoadSample: () => void;
  isAnalyzing: boolean;
  onOpenAuth?: () => void;
  onOpenTutorWithQuery?: (query: string) => void;
  // State from App
  noFiles: JavaFile[];
  setNoFiles: React.Dispatch<React.SetStateAction<JavaFile[]>>;
  fixedFiles: JavaFile[];
  setFixedFiles: React.Dispatch<React.SetStateAction<JavaFile[]>>;
  teacherDoc: string;
  setTeacherDoc: React.Dispatch<React.SetStateAction<string>>;
  statementText: string;
  setStatementText: React.Dispatch<React.SetStateAction<string>>;
  includeInterfaces: boolean;
  setIncludeInterfaces: React.Dispatch<React.SetStateAction<boolean>>;
  useLombok: boolean;
  setUseLombok: React.Dispatch<React.SetStateAction<boolean>>;
  generateTodoComments: boolean;
  setGenerateTodoComments: React.Dispatch<React.SetStateAction<boolean>>;
  javaVersion: '17' | '21' | '11';
  setJavaVersion: React.Dispatch<React.SetStateAction<'17' | '21' | '11'>>;
  purgeFolders: boolean;
  setPurgeFolders: React.Dispatch<React.SetStateAction<boolean>>;
  sanitizeAiComments: boolean;
  setSanitizeAiComments: React.Dispatch<React.SetStateAction<boolean>>;
  checkRubric: boolean;
  setCheckRubric: React.Dispatch<React.SetStateAction<boolean>>;
  evalS3776: boolean;
  setEvalS3776: React.Dispatch<React.SetStateAction<boolean>>;
  evalStringConcat: boolean;
  setEvalStringConcat: React.Dispatch<React.SetStateAction<boolean>>;
  generateJunit5: boolean;
  setGenerateJunit5: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Home: React.FC<HomeProps> = ({
  activeMode,
  onSelectMode,
  onStartAnalysis,
  onOpenDriveModal,
  onLoadSample,
  isAnalyzing,
  onOpenAuth,
  onOpenTutorWithQuery,
  noFiles,
  setNoFiles,
  fixedFiles,
  setFixedFiles,
  teacherDoc,
  setTeacherDoc,
  statementText,
  setStatementText,
  includeInterfaces,
  setIncludeInterfaces,
  useLombok,
  setUseLombok,
  generateTodoComments,
  setGenerateTodoComments,
  javaVersion,
  setJavaVersion,
  purgeFolders,
  setPurgeFolders,
  sanitizeAiComments,
  setSanitizeAiComments,
  checkRubric,
  setCheckRubric,
  evalS3776,
  setEvalS3776,
  evalStringConcat,
  setEvalStringConcat,
  generateJunit5,
  setGenerateJunit5
}) => {
  // Footer Mega Menu State
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(true);

  // Modal State for Legal Documents, Blog Articles & Documentation
  const [footerModalContent, setFooterModalContent] = useState<{
    title: string;
    category?: string;
    content: React.ReactNode;
  } | null>(null);

  // Legal & Blog Modals Handlers
  const handleOpenPrivacyPolicy = () => {
    setFooterModalContent({
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
    });
  };

  const handleOpenTermsOfService = () => {
    setFooterModalContent({
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
    });
  };

  const handleOpenCookiePolicy = () => {
    setFooterModalContent({
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
    });
  };

  const handleOpenGoogleDataPolicy = () => {
    setFooterModalContent({
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
    });
  };

  const handleOpenLegalNotice = () => {
    setFooterModalContent({
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
    });
  };

  const handleOpenBlogArticle = (articleId: string) => {
    const articles: Record<string, { title: string; category: string; content: React.ReactNode }> = {
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
              Escrde Fullstack Web Dev Lovers.
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
    };

    const art = articles[articleId] || {
      title: 'Artículo del Blog Académico',
      category: 'Blog · Fullstack Web Dev Lovers',
      content: <p>Consulta los tutoriales y guías completas en la comunidad de Fullstack Web Dev Lovers en <a href="https://fullstack-dev-lovers.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-pink-600 font-bold hover:underline">fullstack-dev-lovers.vercel.app</a>.</p>
    };

    setFooterModalContent(art);
  };

  const handleOpenDocDoc = (docId: string) => {
    const docs: Record<string, { title: string; category: string; content: React.ReactNode }> = {
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
    };

    const doc = docs[docId] || {
      title: 'Documentación del Sistema',
      category: 'Documentación Técnica',
      content: <p>Manuales y especificaciones técnicas para el desarrollo con Java II y SonarQube en <a href="https://fullstack-dev-lovers.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-bold hover:underline">Fullstack Web Dev Lovers</a>.</p>
    };

    setFooterModalContent(doc);
  };

  // FAQ Toggle
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Unzip and file loading helper
  const processFiles = async (
    files: FileList | File[],
    targetVersion: 'JAVAII_NO' | 'JAVAII-FIXED'
  ) => {
    const loadedFiles: JavaFile[] = [];

    for (const file of Array.from(files)) {
      if (file.name.endsWith('.zip')) {
        try {
          const zip = new JSZip();
          const zipContent = await zip.loadAsync(file);
          for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
            if (!zipEntry.dir && (relativePath.endsWith('.java') || relativePath.endsWith('.txt'))) {
              const text = await zipEntry.async('string');
              loadedFiles.push({
                id: Math.random().toString(36).substring(7),
                name: zipEntry.name.split('/').pop() || zipEntry.name,
                path: relativePath,
                content: text,
                version: targetVersion
              });
            }
          }
        } catch (err) {
          console.error('Error unzipping file:', err);
        }
      } else if (file.name.endsWith('.java') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        loadedFiles.push({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          path: file.name,
          content: text,
          version: targetVersion
        });
      }
    }

    if (targetVersion === 'JAVAII_NO') {
      setNoFiles(prev => [...prev, ...loadedFiles]);
    } else {
      setFixedFiles(prev => [...prev, ...loadedFiles]);
    }
  };

  const handleRunAnalysis = () => {
    const modeSpecificOptions: any = {};

    if (activeMode === 'ARCHITECTURE_NOOB') {
      if (!statementText.trim()) {
        alert('Por favor introduce el enunciado de tu tarea en el campo de texto.');
        return;
      }
      modeSpecificOptions.statementText = statementText;
      modeSpecificOptions.includeInterfaces = includeInterfaces;
      modeSpecificOptions.useLombok = useLombok;
      modeSpecificOptions.generateTodoComments = generateTodoComments;
      modeSpecificOptions.javaVersion = javaVersion;
    } else if (activeMode === 'PRE_SUBMISSION_AUDIT') {
      if (finalNo.length === 0 && finalFixed.length === 0) {
        alert('Por favor sube el archivo .ZIP o tus archivos Java para la auditoría pre-entrega.');
        return;
      }
      modeSpecificOptions.purgeFolders = purgeFolders;
      modeSpecificOptions.sanitizeAiComments = sanitizeAiComments;
      modeSpecificOptions.checkRubric = checkRubric;
    } else if (activeMode === 'SONAR_QUALITY') {
      if (noFiles.length === 0 && fixedFiles.length === 0) {
        alert('Por favor sube tus clases Java para la auditoría SonarQube.');
        return;
      }
      modeSpecificOptions.evalS3776 = evalS3776;
      modeSpecificOptions.evalStringConcat = evalStringConcat;
      modeSpecificOptions.generateJunit5 = generateJunit5;
    } else { // FEEDBACK_REVISION
      if (finalNo.length === 0 && finalFixed.length === 0 && !finalTeacherDoc.trim()) {
        alert('Por favor agrega archivos o pega notas de tu profesora para analizar la subsanación.');
        return;
      }
    }

    onStartAnalysis(noFiles, fixedFiles, teacherDoc || statementText, modeSpecificOptions);
  };

  const modesList = [
    {
      id: 'FEEDBACK_REVISION' as StudentPersonaMode,
      num: '001',
      title: 'Track / Subsanación Feedback',
      subtitle: 'Post-Suspenso & Comparativa AST',
      desc: 'Compara tu borrador o entrega inicial contra las observaciones de tu profesora o las correcciones. Detecta discrepancias de firmas, visibilidad y cumplimiento de rúbrica.',
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      color: 'amber'
    },
    {
      id: 'ARCHITECTURE_NOOB' as StudentPersonaMode,
      num: '002',
      title: 'Model / Guía POO (Enunciados)',
      subtitle: 'Iniciación & Cero Parálisis',
      desc: 'Desglosa enunciados complejos de examen o prácticas en esqueletos POO con clases, atributos privados, interfaces y marcas // TODO para programar autónomamente.',
      icon: <Compass className="w-5 h-5 text-indigo-600" />,
      color: 'indigo'
    },
    {
      id: 'PRE_SUBMISSION_AUDIT' as StudentPersonaMode,
      num: '003',
      title: 'Report / Pre-Entrega & Anti-IA',
      subtitle: 'Higiene de Proyecto & Rúbrica',
      desc: 'Sube tu .ZIP antes de entregar. Purga carpetas temporales de IDE (.idea, target), desinfecta comentarios con huellas delatadoras de IA y valida tu score académico.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      color: 'emerald'
    },
    {
      id: 'SONAR_QUALITY' as StudentPersonaMode,
      num: '004',
      title: 'Act / SonarQube & SOLID',
      subtitle: 'Calidad Industrial & JUnit 5',
      desc: 'Mide la Complejidad Cognitiva (S3776 < 15), elimina duplicaciones, valida principios SOLID y autogenera suites completas de pruebas unitarias con JUnit 5.',
      icon: <Award className="w-5 h-5 text-sky-600" />,
      color: 'sky'
    }
  ];

  return (
    <div className={styles.container}>
      
      {/* 1. HERO SECTION (Serene Zen Cloud & Nebula Palette) */}
      <section className={styles.heroSection}>
        
        {/* Soft floating nebula color clouds */}
        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />
        <div className={styles.heroGlow3} />

        <div className={styles.heroContent}>
          
          {/* Top Monospaced Tag */}
          <Reveal delay={0}>
            <div className={styles.heroTag}>
              <span className={styles.heroTagPulse} />
              <span className={styles.heroTagBrand}>JAVA STUDIO 2026</span>
              <span className={styles.heroTagSeparator}>|</span>
              <a
                href="https://fullstack-dev-lovers.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroTagLink}
              >
                Fullstack Web Dev Lovers <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Reveal>

          {/* Staggered Serif Headline */}
          <h1 className={styles.headline}>
            <Reveal delay={60}>
              <span className={styles.headlineNormal}>Audita tu proyecto Java</span>
            </Reveal>
            <Reveal delay={160}>
              <span className={styles.headlineGradient}>
                y adelántate al feedback de tu profe.
              </span>
            </Reveal>
          </h1>

          {/* Subtitle */}
          <Reveal delay={260}>
            <p className={styles.subtitle}>
              Analiza tus entregas antes de pulsar enviar: detecta fallos de arquitectura POO, limpia comentarios sospechosos de IA y asegúrate de que cumple con las buenas prácticas.
            </p>
          </Reveal>

          {/* Action Buttons (Section 7 ChipButton) */}
          <Reveal delay={360}>
            <div className={styles.heroActions}>
              <ChipButton variant="yellow" onClick={onLoadSample}>
                Cargar Proyecto Borrador
              </ChipButton>
              <ChipButton variant="ghost" onClick={() => {
                const el = document.getElementById('workspace-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explorar 4 Modos
              </ChipButton>
            </div>
          </Reveal>

          {/* Interactive Code / Dashboard Preview Graphic (Modern IDE Card) */}
          <Reveal delay={480}>
            <div className={styles.codePreviewCard}>
              <div className={styles.codePreviewHeader}>
                <div className={styles.trafficLightsContainer}>
                  <div className={styles.trafficLightRed} />
                  <div className={styles.trafficLightYellow} />
                  <div className={styles.trafficLightGreen} />
                  <span className={styles.codePreviewTitle}>
                    <FileCode className="w-3.5 h-3.5 text-purple-600" />
                    FacturacionService.java — Comparativa de Refactorización AST
                  </span>
                </div>
                <div className={styles.codePreviewBadge}>
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Buenas Prácticas: Cumplido (100%)
                </div>
              </div>

              <div className={styles.codePreviewGrid}>
                {/* Borrador inicial card */}
                <div className={styles.codeBlockBefore}>
                  <div className={`${styles.codeBlockHeader} text-rose-300`}>
                    <span className={styles.codeBlockTitle}>
                      <span className={`${styles.codeBlockIndicator} bg-rose-500`} />
                      Borrador Inicial (Alta Complejidad)
                    </span>
                    <span className={`${styles.codeBlockScore} text-rose-400 bg-rose-950/80 border-rose-800`}>
                      S3776 = 28
                    </span>
                  </div>
                  <pre className={`${styles.codeContent} text-slate-300`}>
<span className="text-slate-500 mr-2">1</span><span className="text-purple-300">public double</span> <span className="text-blue-300">calcularTotal</span>() &#123;<br/>
<span className="text-slate-500 mr-2">2</span>  <span className="text-rose-400">// Bucles anidados & try-catch en bucle</span><br/>
<span className="text-slate-500 mr-2">3</span>  <span className="text-purple-300">for</span> (Item item : items) &#123;<br/>
<span className="text-slate-500 mr-2">4</span>    <span className="text-purple-300">if</span> (item.valido()) &#123;<br/>
<span className="text-slate-500 mr-2">5</span>      <span className="text-purple-300">try</span> &#123; ... &#125; <span className="text-purple-300">catch</span> (Exception e) &#123;&#125;<br/>
<span className="text-slate-500 mr-2">6</span>    &#125;<br/>
<span className="text-slate-500 mr-2">7</span>  &#125;<br/>
<span className="text-slate-500 mr-2">8</span>&#125;
                  </pre>
                </div>

                {/* Versión Refactorizada card */}
                <div className={styles.codeBlockAfter}>
                  <div className={`${styles.codeBlockHeader} text-emerald-300`}>
                    <span className={styles.codeBlockTitle}>
                      <span className={`${styles.codeBlockIndicator} bg-emerald-500`} />
                      Versión Refactorizada (Buenas Prácticas)
                    </span>
                    <span className={`${styles.codeBlockScore} text-emerald-400 bg-emerald-950/80 border-emerald-800`}>
                      S3776 = 4
                    </span>
                  </div>
                  <pre className={`${styles.codeContent} text-emerald-200`}>
<span className="text-slate-500 mr-2">1</span><span className="text-purple-300">public double</span> <span className="text-emerald-300">calcularTotal</span>() &#123;<br/>
<span className="text-slate-500 mr-2">2</span>  <span className="text-emerald-400">// Stream API + Invariantes limpias</span><br/>
<span className="text-slate-500 mr-2">3</span>  <span className="text-purple-300">return</span> items.stream()<br/>
<span className="text-slate-500 mr-2">4</span>    .filter(Item::valido)<br/>
<span className="text-slate-500 mr-2">5</span>    .mapToDouble(<span className="text-purple-300">this</span>::procesarPrecioSeguro)<br/>
<span className="text-slate-500 mr-2">6</span>    .sum();<br/>
<span className="text-slate-500 mr-2">7</span>&#125;
                  </pre>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </section>


      {/* 2. FEATURES LIST 001–004 (Section 8 of Aetherfield Guide) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionEyebrow}>
              ▪ MODOS ACADÉMICOS DE TRABAJO
            </div>
            <h2 className={styles.sectionTitle}>
              Cuatro perfiles adaptados a tu momento académico
            </h2>
          </div>
          <p className={styles.sectionDescription}>
            Cada modo activa un motor de IA especializado que comprende el contexto de las asignaturas de Programación II de la universidad.
          </p>
        </div>

        <div className={styles.modesGrid}>
          {modesList.map((mode, i) => (
            <Reveal key={mode.id} delay={i * 80}>
              <div
                onClick={() => {
                  onSelectMode(mode.id);
                  const el = document.getElementById('workspace-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`${styles.modeCard} ${
                  activeMode === mode.id
                    ? styles.active
                    : styles.inactive
                }`}
              >
                <div className="space-y-4">
                  <div className={styles.modeCardHeader}>
                    <span className={styles.modeCardNumber}>
                      {mode.num}
                    </span>
                    <div className={styles.modeCardIconContainer}>
                      {mode.icon}
                    </div>
                  </div>

                  <div>
                    <h3 className={styles.modeCardTitle}>
                      {mode.title}
                    </h3>
                    <span className={styles.modeCardSubtitle}>
                      {mode.subtitle}
                    </span>
                  </div>

                  <p className={styles.modeCardDescription}>
                    {mode.desc}
                  </p>
                </div>

                <div className={styles.modeCardAction}>
                  <span>Seleccionar Modo</span>
                  <ArrowRight className={styles.modeCardArrow} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* 3. PRINCIPIOS ("Built for clarity / Designed for action") */}
      <section className={styles.section}>
        <div className={styles.centeredSectionHeader}>
          <span className={styles.sectionEyebrow}>
            ▪ PRINCIPIOS DE DISEÑO ZEN
          </span>
          <h2 className={styles.sectionTitle}>
            Creado para la claridad. Diseñado para la acción.
          </h2>
          <p className={styles.sectionDescription}>
            Principios éticos y metodológicos que garantizan un aprendizaje sólido sin violar la honestidad académica.
          </p>
        </div>

        <div className={styles.principlesGrid}>
          <Reveal delay={0}>
            <div className={`${styles.principleCard} to-sky-50/50`}>
              <div className={`${styles.principleIconContainer} bg-indigo-100 text-indigo-700`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className={styles.principleTitle}>1. Cero Parálisis en Blanco</h3>
              <p className={styles.principleDescription}>
                Transforma enunciados ambiguos en esqueletos POO claros con comentarios // TODO. No hace el trabajo por ti, te marca el camino para programarlo tú mismo.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className={`${styles.principleCard} to-amber-50/50`}>
              <div className={`${styles.principleIconContainer} bg-amber-100 text-amber-800`}>
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className={styles.principleTitle}>2. Respeto a tu Estilo</h3>
              <p className={styles.principleDescription}>
                Conserva tus nombres de variables, métodos e identificadores en las correcciones. La IA ajusta la arquitectura sin reescribir tu lógica desde cero.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className={`${styles.principleCard} to-emerald-50/50`}>
              <div className={`${styles.principleIconContainer} bg-emerald-100 text-emerald-800`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className={styles.principleTitle}>3. Higiene & Anti-Plagio</h3>
              <p className={styles.principleDescription}>
                Purga archivos temporales de IDEs (.idea/, target/) y desinfecta comentarios con expresiones delatadoras de ChatGPT antes de subir el .ZIP a la intranet.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DEDICATED ON-PAGE README SECTION */}
      <section id="readme-section" className={styles.readmeSection}>
        <div className={styles.readmeCard}>
          
          {/* Header Badge */}
          <div className={styles.readmeHeader}>
            <div className={styles.readmeIconContainer}>
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className={styles.readmeEyebrow}>
                <span>README.md</span>
                <span className={styles.readmeBadge}>
                  Informe Pedagógico
                </span>
              </div>
              <h2 className={styles.readmeTitle}>
                Guía del Aprendiz de Java: Objetivos & Modos de Evaluación
              </h2>
            </div>
          </div>

          {/* Justification Block */}
          <div className={styles.justificationBlock}>
            <h3 className={styles.justificationTitle}>
              <GraduationCap className="w-5 h-5 text-purple-600" />
              ¿Por qué Java Studio es la herramienta ideal para un estudiante de Java?
            </h3>
            <p className={styles.justificationText}>
              La mayoría de los estudiantes cometen el error de pedir a un modelo generativo genérico que resuelva sus ejercicios enteros. Esto genera tres problemas graves:
            </p>
            <ul className={styles.justificationGrid}>
              <li className={styles.justificationItem}>
                <strong className={`${styles.justificationItemTitle} text-rose-600`}>1. Estilo Delatador</strong>
                <span className={styles.justificationItemText}>Produce comentarios tipo <i>"Here is the implementation"</i> que delatan uso no autorizado de IA.</span>
              </li>
              <li className={styles.justificationItem}>
                <strong className={`${styles.justificationItemTitle} text-amber-600`}>2. Complejidad innecesaria</strong>
                <span className={styles.justificationItemText}>Aplica patrones avanzados que no corresponden al nivel universitario Java II.</span>
              </li>
              <li className={styles.justificationItem}>
                <strong className={`${styles.justificationItemTitle} text-indigo-600`}>3. Nulo aprendizaje</strong>
                <span className={styles.justificationItemText}>Copiar y pegar impide desarrollar intuición sobre orientación a objetos y refactorización.</span>
              </li>
            </ul>
            <p className={styles.justificationConclusion}>
              <strong>Java Studio actúa como un tutor pedagógico</strong>: respeta la autoría y la nomenclatura del estudiante, desinfecta el código antes de la entrega y guía paso a paso según los cuatro momentos clave del aprendizaje universitario.
            </p>
          </div>

          {/* 4 Modes Breakdown */}
          <div className={styles.modesBreakdown}>
            <h3 className={styles.modesBreakdownTitle}>
              Desglose de los 4 Modos de Trabajo
            </h3>

            <div className={styles.modesBreakdownGrid}>
              
              {/* Modo 01 */}
              <div className={`${styles.modeDetailCard} bg-amber-50/50 border border-amber-200/80`}>
                <div className={styles.modeDetailHeader}>
                  <span className={`${styles.modeDetailBadge} text-amber-800 bg-amber-100`}>
                    01. Subsanación Feedback
                  </span>
                  <span className={`${styles.modeDetailTag} text-amber-700`}>Post-Suspenso</span>
                </div>
                <h4 className={styles.modeDetailTitle}>
                  Corrección basada en observaciones del profesor
                </h4>
                <p className={styles.modeDetailDescription}>
                  <strong>Objetivo:</strong> Revisa borradores o exámenes suspendidos cruzándolos con los comentarios escritos por el docente o la rúbrica de corrección.
                </p>
                <div className={`${styles.modeDetailTip} border-amber-200/60 text-amber-950`}>
                  💡 <i>Ideal para:</i> Convertir correcciones ambiguas del tipo "Mejorar cohesión" en cambios exactos de código manteniendo tu estilo original.
                </div>
              </div>

              {/* Modo 02 */}
              <div className={`${styles.modeDetailCard} bg-indigo-50/50 border border-indigo-200/80`}>
                <div className={styles.modeDetailHeader}>
                  <span className={`${styles.modeDetailBadge} text-indigo-800 bg-indigo-100`}>
                    02. Guía POO (Enunciado)
                  </span>
                  <span className={`${styles.modeDetailTag} text-indigo-700`}>Iniciación</span>
                </div>
                <h4 className={styles.modeDetailTitle}>
                  Generación de Esqueletos desde el Enunciado
                </h4>
                <p className={styles.modeDetailDescription}>
                  <strong>Objetivo:</strong> Elimina la "parálisis frente al folio en blanco" leyendo enunciados extensos para diseñar el diagrama de clases y firmas de métodos.
                </p>
                <div className={`${styles.modeDetailTip} border-indigo-200/60 text-indigo-950`}>
                  💡 <i>Ideal para:</i> Empezar una práctica desde cero con esqueletos compilables llenos de comentarios <code>// TODO</code> pedagógicos.
                </div>
              </div>

              {/* Modo 03 */}
              <div className={`${styles.modeDetailCard} bg-emerald-50/50 border border-emerald-200/80`}>
                <div className={styles.modeDetailHeader}>
                  <span className={`${styles.modeDetailBadge} text-emerald-800 bg-emerald-100`}>
                    03. Pre-Entrega & Anti-IA
                  </span>
                  <span className={`${styles.modeDetailTag} text-emerald-700`}>Higiene & Rúbrica</span>
                </div>
                <h4 className={styles.modeDetailTitle}>
                  Auditoría de Calidad e Higiene Académica
                </h4>
                <p className={styles.modeDetailDescription}>
                  <strong>Objetivo:</strong> Desinfecta frases delatadoras de ChatGPT, elimina archivos temporales de compilación (<code>.idea/</code>, <code>target/</code>) y verifica el cumplimiento de la rúbrica.
                </p>
                <div className={`${styles.modeDetailTip} border-emerald-200/60 text-emerald-950`}>
                  💡 <i>Ideal para:</i> Asegurar que tu archivo ZIP esté impecable minutos antes de la hora límite de entrega en la intranet.
                </div>
              </div>

              {/* Modo 04 */}
              <div className={`${styles.modeDetailCard} bg-sky-50/50 border border-sky-200/80`}>
                <div className={styles.modeDetailHeader}>
                  <span className={`${styles.modeDetailBadge} text-sky-800 bg-sky-100`}>
                    04. SonarQube & SOLID
                  </span>
                  <span className={`${styles.modeDetailTag} text-sky-700`}>Calidad Industrial</span>
                </div>
                <h4 className={styles.modeDetailTitle}>
                  Refactorización y Pruebas Unitarias JUnit 5
                </h4>
                <p className={styles.modeDetailDescription}>
                  <strong>Objetivo:</strong> Reduce la complejidad cognitiva de métodos anidados y genera baterías de tests JUnit 5 desacopladas con Mocks.
                </p>
                <div className={`${styles.modeDetailTip} border-sky-200/60 text-sky-950`}>
                  💡 <i>Ideal para:</i> Alcanzar la máxima nota en proyectos que exigen métricas profesionales de calidad de software.
                </div>
              </div>

            </div>
          </div>

          {/* Call to action */}
          <div className={styles.readmeCtaContainer}>
            <span className={styles.readmeCtaText}>
              Selecciona cualquiera de los 4 modos arriba para comenzar tu auditoría Java.
            </span>
            <button
              onClick={() => {
                const el = document.getElementById('workspace-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={styles.readmeCtaButton}
            >
              <span>Ir al Espacio de Trabajo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>


      {/* 4. CASE STUDY (Ethereal Nebula Box) */}
      <section className={styles.section}>
        <Reveal delay={0}>
          <div className={styles.caseStudyCard}>
            
            {/* Duotone Visual Box */}
            <div className={styles.caseStudyVisualBox}>
              <div className={styles.caseStudyIconContainer}>
                <Award className="w-8 h-8" />
              </div>
              <div className={styles.caseStudyScore}>3.8 ➔ 9.8</div>
              <p className={styles.caseStudyScoreLabel}>
                Evolución de Nota en Java II
              </p>
              <div className={styles.caseStudyMetrics}>
                <div className={styles.caseStudyMetricItem}>
                  <span>Regla SonarQube S3776:</span>
                  <span className={styles.caseStudyMetricValue}>Superada (&lt; 12)</span>
                </div>
                <div className={styles.caseStudyMetricItem}>
                  <span>Cobertura JUnit 5:</span>
                  <span className={styles.caseStudyMetricValue}>88.4%</span>
                </div>
                <div className={styles.caseStudyMetricItem}>
                  <span>Alineación Rúbrica:</span>
                  <span className={styles.caseStudyMetricValue}>100% Ok</span>
                </div>
              </div>
            </div>

            {/* Content Text */}
            <div className={styles.caseStudyContent}>
              <span className={`${styles.sectionEyebrow} !text-sky-800`}>
                ▪ CASO DE ÉXITO ACADÉMICO
              </span>
              <h3 className={styles.caseStudyTitle}>
                De suspenso en la primera entrega a sobresaliente mediante subsanación de AST
              </h3>
              <p className={styles.caseStudyDescription}>
                "Había suspendido con un 3.8 debido a acoplamiento excesivo y violaciones de la regla SonarQube S3776. Al cargar mi proyecto inicial y las notas de mi profesora en Java Studio, el sistema me generó la refactorización exacta conservando mi lógica. Aprobé con un 9.8 en la recuperación."
              </p>
              <div className={styles.caseStudyAction}>
                <ChipButton variant="ghost" onClick={onLoadSample}>
                  Ver Proyecto de Ejemplo
                </ChipButton>
              </div>
            </div>

          </div>
        </Reveal>
      </section>


      {/* 5. JOURNAL / ARTÍCULOS ACADÉMICOS */}
      <section className={styles.section}>
        <div className={styles.journalHeader}>
          <div>
            <span className={`${styles.sectionEyebrow} block`}>
              ▪ DESDE EL JOURNAL ACADÉMICO
            </span>
            <h2 className={styles.sectionTitle}>
              Guías y mejores prácticas Java II
            </h2>
          </div>
          <button
            onClick={() => onOpenTutorWithQuery && onOpenTutorWithQuery('Muéstrame recomendaciones para aprobar Java II')}
            className={styles.journalViewAll}
          >
            <span>Ver todas las guías</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className={styles.journalGrid}>
          <Reveal delay={0}>
            <div className={styles.journalArticle}>
              <div className={styles.journalArticleCard}>
                <div className={`${styles.journalArticleIcon} bg-sky-50 text-sky-600`}>
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className={styles.journalArticleTitle}>
                  Cómo superar la regla SonarQube S3776 de Complejidad Cognitiva
                </h3>
                <p className={styles.journalArticleMeta}>
                  Calidad Industrial · 4 min lectura
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className={styles.journalArticle}>
              <div className={styles.journalArticleCard}>
                <div className={`${styles.journalArticleIcon} bg-emerald-50 text-emerald-600`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className={styles.journalArticleTitle}>
                  Sanitización Anti-IA: Evita firmas delatadoras en comentarios Java
                </h3>
                <p className={styles.journalArticleMeta}>
                  Higiene Pre-Entrega · 6 min lectura
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className={styles.journalArticle}>
              <div className={styles.journalArticleCard}>
                <div className={`${styles.journalArticleIcon} bg-indigo-50 text-indigo-600`}>
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className={styles.journalArticleTitle}>
                  Diseño de Jerarquías POO e Interfaces para Exámenes Prácticos
                </h3>
                <p className={styles.journalArticleMeta}>
                  Arquitectura POO · 5 min lectura
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* 6. TESTIMONIAL / CITA GRANDE (Serene Cloud Box) */}
      <section className={styles.testimonialSection}>
        <Reveal delay={0}>
          <div className={styles.testimonialStars}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <blockquote className={styles.testimonialQuote}>
            "Java Studio transformó mi parálisis frente al enunciado en una hoja de ruta clara paso a paso. Pasé mi entrega de Java II a la primera sin perder mi propio estilo."
          </blockquote>
          <div className={styles.testimonialAuthor}>
            — Carlos M., Estudiante de Grado en Ingeniería Informática
          </div>
        </Reveal>
      </section>


      {/* 7. IN-PAGE WORKSPACE DASHBOARD */}
      <section id="workspace-section" className={styles.workspaceSection}>
        
        <div className={styles.workspaceHeader}>
          <span className={styles.sectionEyebrow}>
            ▪ CONSOLA OPERATIVA DE TRABAJO
          </span>
          <h2 className={styles.sectionTitle}>
            Ejecuta tu análisis en el Modo Activo
          </h2>
          <p className={styles.sectionDescription}>
            Selecciona el perfil adecuado, adjunta tus archivos o enunciado y haz clic en Iniciar Análisis.
          </p>
        </div>

        {/* Mode Navigation Tabs Bar - Strict Container Layout */}
        <div className={styles.modeNavBar}>
          <div className={styles.modeNavGrid}>
            {modesList.map(m => (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`${styles.modeNavButton} ${
                  activeMode === m.id
                    ? styles.active
                    : styles.inactive
                }`}
              >
                <span className={styles.modeNavButtonNumber}>▪ {m.num}</span>
                <span className={styles.modeNavButtonTitle}>{m.title.split('/')[1] || m.title}</span>
              </button>
            ))}
          </div>

          <button
            onClick={onLoadSample}
            className={styles.loadDemoButton}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Cargar Demo</span>
          </button>
        </div>

        {/* WORKSPACE CONTENT PER ACTIVE MODE */}
        <div className={styles.workspaceContent}>
          
          <div className={styles.workspaceContentHeader}>
            <div>
              <h3 className={styles.workspaceContentTitle}>
                <Settings2 className="w-5 h-5 text-sky-600" />
                <span>Configuración: <strong className="text-sky-900">{activeMode}</strong></span>
              </h3>
              <p className={styles.workspaceContentSubtitle}>
                Asegúrate de incluir tus clases o enunciados antes de procesar.
              </p>
            </div>

            <div className={styles.workspaceContentActions}>
              <button
                onClick={onOpenDriveModal}
                className={styles.driveButton}
              >
                <HardDrive className="w-3.5 h-3.5 text-sky-600" /> Google Drive
              </button>
            </div>
          </div>

          {/* MODE 1 WORKSPACE: Subsanación Feedback */}
          {activeMode === 'FEEDBACK_REVISION' && (
            <div className={styles.modeWorkspaceContainer}>
              <div className={styles.fileDropGrid}>
                
                {/* Box 1: Proyecto Borrador / Inicial */}
                <div className={`${styles.fileDropZone} bg-rose-50/50 border-rose-200 hover:border-rose-400`}>
                  <div className={styles.fileDropHeader}>
                    <span className={`${styles.fileDropBadge} bg-rose-100 text-rose-900`}>
                      1. Proyecto Borrador / Inicial
                    </span>
                    <span className={styles.fileCount}>{noFiles.length} archivo(s)</span>
                  </div>

                  <label className={`${styles.fileDropLabel} border-rose-100`}>
                    <Upload className="w-8 h-8 text-rose-500 mb-2" />
                    <span className={`${styles.fileDropText} text-rose-900`}>
                      Seleccionar .java o .zip de borrador original
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".java,.zip,.txt"
                      className="hidden"
                      onChange={(e) => e.target.files && processFiles(e.target.files, 'JAVAII_NO')}
                    />
                  </label>

                  {noFiles.length > 0 && (
                    <ul className={`${styles.fileList} divide-rose-100`}>
                      {noFiles.map((f, i) => (
                        <li key={i} className={styles.fileListItem}>
                          <span className="truncate">{f.name}</span>
                          <span className={`${styles.fileListItemVersion} text-rose-600`}>Borrador Inicial</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Box 2: Código Corregido */}
                <div className={`${styles.fileDropZone} bg-emerald-50/50 border-emerald-200 hover:border-emerald-400`}>
                  <div className={styles.fileDropHeader}>
                    <span className={`${styles.fileDropBadge} bg-emerald-100 text-emerald-900`}>
                      2. Código Corregido (Opcional)
                    </span>
                    <span className={styles.fileCount}>{fixedFiles.length} archivo(s)</span>
                  </div>

                  <label className={`${styles.fileDropLabel} border-emerald-100`}>
                    <Upload className="w-8 h-8 text-emerald-600 mb-2" />
                    <span className={`${styles.fileDropText} text-emerald-900`}>
                      Seleccionar .java o .zip corregido
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".java,.zip,.txt"
                      className="hidden"
                      onChange={(e) => e.target.files && processFiles(e.target.files, 'JAVAII-FIXED')}
                    />
                  </label>

                  {fixedFiles.length > 0 && (
                    <ul className={`${styles.fileList} divide-emerald-100`}>
                      {fixedFiles.map((f, i) => (
                        <li key={i} className={styles.fileListItem}>
                          <span className="truncate">{f.name}</span>
                          <span className={`${styles.fileListItemVersion} text-emerald-700`}>JAVAII-FIXED</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {/* Document / Teacher Notes textarea */}
              <div className={styles.teacherNotesContainer}>
                <label className={styles.label}>
                  Notas / Correcciones por escrito de la Profesora (Opcional):
                </label>
                <textarea
                  rows={3}
                  value={teacherDoc}
                  onChange={(e) => setTeacherDoc(e.target.value)}
                  placeholder="Pega aquí los comentarios en texto que te envió tu profesora por email o la intranet..."
                  className={styles.textarea}
                />
              </div>
            </div>
          )}

          {/* MODE 2 WORKSPACE: Guía POO / Enunciado */}
          {activeMode === 'ARCHITECTURE_NOOB' && (
            <div className={styles.modeWorkspaceContainer}>
              <div className={styles.teacherNotesContainer}>
                <div className={styles.statementHeader}>
                  <label className={styles.statementLabel}>
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Texto del Enunciado de tu Tarea / Examen:
                  </label>
                  <span className={styles.statementTag}>Parser Gramatical POO</span>
                </div>
                <textarea
                  rows={6}
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  placeholder="Pega aquí el texto del PDF de tu práctica (ej: 'Se pide diseñar un sistema para una biblioteca universitaria con Clientes, Libros y Prestamos...')"
                  className={styles.statementTextarea}
                />
              </div>

              <div className={`${styles.optionsContainer} bg-indigo-50/60 border-indigo-200`}>
                <span className={`${styles.optionsTitle} text-indigo-900`}>
                  Opciones de Generación de Arquitectura POO:
                </span>
                <div className={styles.optionsGrid}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={includeInterfaces}
                      onChange={(e) => setIncludeInterfaces(e.target.checked)}
                      className={`${styles.checkbox} text-indigo-600 focus:ring-indigo-500`}
                    />
                    <span>Incluir Interfaces Java</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={useLombok}
                      onChange={(e) => setUseLombok(e.target.checked)}
                      className={`${styles.checkbox} text-indigo-600 focus:ring-indigo-500`}
                    />
                    <span>Usar Anotaciones Lombok</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={generateTodoComments}
                      onChange={(e) => setGenerateTodoComments(e.target.checked)}
                      className={`${styles.checkbox} text-indigo-600 focus:ring-indigo-500`}
                    />
                    <span>Generar Guía con // TODO</span>
                  </label>

                  <div className={styles.selectContainer}>
                    <span className={styles.selectLabel}>Versión Java:</span>
                    <select
                      value={javaVersion}
                      onChange={(e) => setJavaVersion(e.target.value as any)}
                      className={styles.select}
                    >
                      <option value="17">Java 17 (LTS)</option>
                      <option value="21">Java 21 (LTS)</option>
                      <option value="11">Java 11</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3 WORKSPACE: Pre-Entrega Anti-IA */}
          {activeMode === 'PRE_SUBMISSION_AUDIT' && (
            <div className={styles.modeWorkspaceContainer}>
              <div className={`${styles.zipDropZone} bg-emerald-50/40 border-emerald-300 hover:border-emerald-500`}>
                <Upload className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h3 className={styles.zipDropTitle}>
                  Arrastra tu Proyecto Completo en Formato .ZIP
                </h3>
                <p className={styles.zipDropDescription}>
                  Escanearemos la estructura interna para detectar carpetas basura y comentarios con firma de IA.
                </p>

                <label className={`${styles.zipDropButton} bg-emerald-600 hover:bg-emerald-500`}>
                  <span>Seleccionar Archivo .ZIP o .Java</span>
                  <input
                    type="file"
                    multiple
                    accept=".zip,.java"
                    className="hidden"
                    onChange={(e) => e.target.files && processFiles(e.target.files, 'JAVAII_NO')}
                  />
                </label>

                {noFiles.length > 0 && (
                  <div className={`${styles.zipFileListContainer} border-emerald-200 text-emerald-950`}>
                    <span className={styles.zipFileListTitle}>Archivos cargados para escaneo ({noFiles.length}):</span>
                    <ul className={`${styles.zipFileList} divide-emerald-100`}>
                      {noFiles.map((f, idx) => (
                        <li key={idx} className={styles.zipFileListItem}>{f.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={`${styles.optionsContainer} bg-emerald-50/60 border-emerald-200`}>
                <span className={`${styles.optionsTitle} text-emerald-950`}>
                  Filtros de Sanitización Activados:
                </span>
                <div className={`${styles.optionsGrid} !grid-cols-1 sm:!grid-cols-2`}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={purgeFolders}
                      onChange={(e) => setPurgeFolders(e.target.checked)}
                      className={`${styles.checkbox} text-emerald-600 focus:ring-emerald-500`}
                    />
                    <span>Purga de carpetas .idea/, target/ y .DS_Store</span>
                  </label>

                  <label className={`${styles.checkboxLabel} col-span-1 sm:col-span-2`}>
                    <input
                      type="checkbox"
                      checked={sanitizeAiComments}
                      onChange={(e) => setSanitizeAiComments(e.target.checked)}
                      className={`${styles.checkbox} text-emerald-600 focus:ring-emerald-500`}
                    />
                    <span>Sanitizador de Comentarios de IA</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={checkRubric}
                      onChange={(e) => setCheckRubric(e.target.checked)}
                      className={`${styles.checkbox} text-emerald-600 focus:ring-emerald-500`}
                    />
                    <span>Verificar Score de Rúbrica</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* MODE 4 WORKSPACE: SonarQube & SOLID */}
          {activeMode === 'SONAR_QUALITY' && (
            <div className={styles.modeWorkspaceContainer}>
              <div className={`${styles.zipDropZone} bg-sky-50/40 border-sky-300 hover:border-sky-500`}>
                <Award className="w-10 h-10 text-sky-600 mx-auto mb-3" />
                <h3 className={styles.zipDropTitle}>
                  Carga tus Clases Java para Análisis de Calidad SonarQube
                </h3>
                <p className={styles.zipDropDescription}>
                  Mide la Complejidad Cognitiva S3776 y genera suites de pruebas unitarias JUnit 5.
                </p>

                <label className={`${styles.zipDropButton} bg-sky-600 hover:bg-sky-500`}>
                  <span>Seleccionar Clases .java o .ZIP</span>
                  <input
                    type="file"
                    multiple
                    accept=".java,.zip"
                    className="hidden"
                    onChange={(e) => e.target.files && processFiles(e.target.files, 'JAVAII_NO')}
                  />
                </label>

                {noFiles.length > 0 && (
                  <div className={`${styles.zipFileListContainer} border-sky-200 text-sky-950`}>
                    <span className={styles.zipFileListTitle}>Clases cargadas ({noFiles.length}):</span>
                    <ul className={`${styles.zipFileList} divide-sky-100`}>
                      {noFiles.map((f, idx) => (
                        <li key={idx} className={styles.zipFileListItem}>{f.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={`${styles.optionsContainer} bg-sky-50/60 border-sky-200`}>
                <span className={`${styles.optionsTitle} text-sky-950`}>
                  Reglas y Pruebas a Evaluar:
                </span>
                <div className={`${styles.optionsGrid} !grid-cols-1 sm:!grid-cols-2`}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={evalS3776}
                      onChange={(e) => setEvalS3776(e.target.checked)}
                      className={`${styles.checkbox} text-sky-600 focus:ring-sky-500`}
                    />
                    <span>Regla S3776 (Complejidad Cognitiva &lt; 15)</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={evalStringConcat}
                      onChange={(e) => setEvalStringConcat(e.target.checked)}
                      className={`${styles.checkbox} text-sky-600 focus:ring-sky-500`}
                    />
                    <span>Regla S1192 (Concatenación de Strings)</span>
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={generateJunit5}
                      onChange={(e) => setGenerateJunit5(e.target.checked)}
                      className={`${styles.checkbox} text-sky-600 focus:ring-sky-500`}
                    />
                    <span>Autogenerar Suite JUnit 5 (@Test)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* EXECUTE CTA */}
          <div className={styles.executeCtaContainer}>
            <div className={styles.executeCtaLabel}>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Motor de Evaluación Java Studio
            </div>

            <ChipButton
              variant="yellow"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
            >
              {activeMode === 'FEEDBACK_REVISION' && 'Analizar & Subsanar Feedback'}
              {activeMode === 'ARCHITECTURE_NOOB' && 'Generar Esqueleto POO'}
              {activeMode === 'PRE_SUBMISSION_AUDIT' && 'Auditar & Sanitizar .ZIP'}
              {activeMode === 'SONAR_QUALITY' && 'Ejecutar SonarQube & JUnit 5'}
            </ChipButton>
          </div>

        </div>

      </section>


      {/* 8. FAQ ACCORDION PER MODE */}
      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <div>
            <span className={`${styles.sectionEyebrow} block mb-1`}>
              ▪ PREGUNTAS FRECUENTES
            </span>
            <h3 className={styles.faqTitle}>
              Preguntas Frecuentes ({activeMode})
            </h3>
          </div>

          {onOpenTutorWithQuery && (
            <button
              onClick={() => onOpenTutorWithQuery(`Tengo dudas sobre cómo funciona el modo ${activeMode}`)}
              className={styles.faqAskButton}
            >
              <Bot className="w-3.5 h-3.5 text-amber-700" />
              <span>Preguntar a Profe Virtual</span>
            </button>
          )}
        </div>

        <div className={styles.faqAccordion}>
          {[
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
          ].map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                className={styles.faqItem}
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className={styles.faqQuestion}
                >
                  <span className={styles.faqQuestionContent}>
                    <span className={styles.faqNumber}>
                      {idx + 1}
                    </span>
                    {faq.q}
                  </span>
                  {isExpanded ? <ChevronUp className={`${styles.faqChevron} text-sky-700`} /> : <ChevronDown className={`${styles.faqChevron} text-slate-400`} />}
                </button>

                {isExpanded && (
                  <div className={styles.faqAnswer}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* 9. FINAL CTA (Pink-Purple Gradient Ethereal Section) */}
      <section className={styles.finalCtaSection}>
        <Reveal delay={0}>
          <div className={styles.finalCtaBadge}>
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Impulsado por Fullstack Web Dev Lovers</span>
          </div>
          <h2 className={styles.finalCtaTitle}>
            ¿Preparado para asegurar tu Aprobado con Distinción en Java II?
          </h2>
          <p className={styles.finalCtaSubtitle}>
            Carga tu proyecto de prueba o conecta tu Google Drive en segundos.
          </p>
          <div className={styles.finalCtaActions}>
            <ChipButton variant="yellow" onClick={onLoadSample}>
              ▪ Probar Demo Gratis
            </ChipButton>
            <a
              href="https://fullstack-dev-lovers.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.communityLink}
            >
              <Globe className="w-4 h-4 text-purple-600" />
              <span>Fullstack Dev Lovers <ExternalLink className="w-3 h-3" /></span>
            </a>
          </div>
        </Reveal>
      </section>


      {/* 10. MEGA MENU FOOTER (Edición Fullstack Web Dev Lovers) */}
      <footer className={styles.footer}>
        {/* Soft background glow */}
        <div className={styles.footerGlow1} />
        <div className={styles.footerGlow2} />

        <div className={styles.footerContent}>
          
          {/* Top Community Link Banner */}
          <div className={styles.megaMenuBanner}>
            <div className={styles.megaMenuBannerContent}>
              <div className={styles.megaMenuIcon}>
                J
              </div>
              <div>
                <h3 className={styles.megaMenuTitle}>
                  Java Studio Megamenú & Comunidad
                </h3>
                <p className={styles.megaMenuSubtitle}>
                  Navegación integral por la plataforma, guías pedagógicas, rúbricas de evaluación y comunidad Fullstack Web Dev Lovers.
                </p>
              </div>
            </div>

            <div className={styles.megaMenuActions}>
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={styles.toggleMegaMenuButton}
              >
                <span>{isMegaMenuOpen ? 'Plegar Megamenú' : 'Desplegar Megamenú'}</span>
                <ChevronDown className={`${styles.toggleMegaMenuChevron} ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <a
                href="https://fullstack-dev-lovers.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.communityButton}
              >
                <span>Fullstack Dev Lovers</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* MEGA MENU GRID (Distinct Columns) */}
          {isMegaMenuOpen && (
            <div className={styles.megaMenuGridContainer}>
              
              <div className={styles.megaMenuGridHeader}>
                <div className={styles.megaMenuGridTitle}>
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>Megamenú de Navegación & Recursos por Categorías</span>
                </div>
                <span className={styles.megaMenuGridSubtitle}>
                  5 Columnas Especializadas
                </span>
              </div>

              <div className={styles.megaMenuGrid}>
                
                {/* Col 1: Modos de Evaluación POO */}
                <div className={styles.megaMenuColumn}>
                  <div className={`${styles.megaMenuColTitle} text-pink-400`}>
                    <Terminal className="w-4 h-4" />
                    <span>01. Modos POO</span>
                  </div>
                  <p className={styles.megaMenuColDescription}>
                    Navega y activa los cuatro flujos de trabajo de evaluación Java II:
                  </p>
                  <ul className={styles.megaMenuColList}>
                    <li>
                      <button onClick={() => onSelectMode('FEEDBACK_REVISION')} className={styles.megaMenuColLink}>
                        <span className={`${styles.megaMenuColLinkDot} bg-amber-400`} />
                        <span>01. Subsanación Feedback</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onSelectMode('ARCHITECTURE_NOOB')} className={styles.megaMenuColLink}>
                        <span className={`${styles.megaMenuColLinkDot} bg-indigo-400`} />
                        <span>02. Guía POO (Enunciado)</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onSelectMode('PRE_SUBMISSION_AUDIT')} className={styles.megaMenuColLink}>
                        <span className={`${styles.megaMenuColLinkDot} bg-emerald-400`} />
                        <span>03. Pre-Entrega & Anti-IA</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => onSelectMode('SONAR_QUALITY')} className={styles.megaMenuColLink}>
                        <span className={`${styles.megaMenuColLinkDot} bg-sky-400`} />
                        <span>04. SonarQube & SOLID</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Col 2: Documentación & Rúbricas */}
                <div className={`${styles.megaMenuColumn} hover:border-purple-500/30`}>
                  <div className={`${styles.megaMenuColTitle} text-purple-400`}>
                    <BookOpen className="w-4 h-4" />
                    <span>02. Documentación</span>
                  </div>
                  <p className={styles.megaMenuColDescription}>
                    Guías pedagógicas, rúbricas docentes y reglas de calidad:
                  </p>
                  <ul className={styles.megaMenuColListSans}>
                    <li>
                      <button
                        onClick={() => {
                          const el = document.getElementById('readme-section') || document.getElementById('readme');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={styles.megaMenuColLinkSpecial}
                      >
                        <span>• README (Guía Aprendiz)</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenDocDoc('rubrica-java2')} className={`${styles.megaMenuColLinkSans} !font-normal`}>
                        • Rúbrica Oficial Java II
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenBlogArticle('sonarqube-s3776')} className={`${styles.megaMenuColLinkSans} !font-normal`}>
                        • Regla SonarQube S3776
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenDocDoc('junit5-cheat')} className={`${styles.megaMenuColLinkSans} !font-normal`}>
                        • Cheat Sheet JUnit 5
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenGoogleDataPolicy()} className={`${styles.megaMenuColLinkSans} !font-normal`}>
                        • Guía API Google Drive
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Blog Académico */}
                <div className={`${styles.megaMenuColumn} hover:border-indigo-500/30`}>
                  <div className={`${styles.megaMenuColTitle} text-indigo-400`}>
                    <FileText className="w-4 h-4" />
                    <span>03. Blog Académico</span>
                  </div>
                  <p className={styles.megaMenuColDescription}>
                    Casos prácticos de la comunidad y técnicas de refactorización:
                  </p>
                  <ul className={styles.megaMenuColListSans}>
                    <li>
                      <button onClick={() => handleOpenBlogArticle('38-to-98')} className={`${styles.megaMenuColLinkSans} !font-normal !text-indigo-300/80 hover:!text-indigo-300`}>
                        • Caso de Estudio: 3.8 a 9.8
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenBlogArticle('sonarqube-s3776')} className={`${styles.megaMenuColLinkSans} !font-normal !text-indigo-300/80 hover:!text-indigo-300`}>
                        • Reducción Complejidad S3776
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenBlogArticle('anti-ai-cleanup')} className={`${styles.megaMenuColLinkSans} !font-normal !text-indigo-300/80 hover:!text-indigo-300`}>
                        • Desinfección Rastros ChatGPT
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenBlogArticle('solid-university')} className={`${styles.megaMenuColLinkSans} !font-normal !text-indigo-300/80 hover:!text-indigo-300`}>
                        • Principios SOLID en Exámenes
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Col 4: Transparencia & Permisos Google API */}
                <div className={`${styles.megaMenuColumn} hover:border-sky-500/30`}>
                  <div className={`${styles.megaMenuColTitle} text-sky-400`}>
                    <Scale className="w-4 h-4" />
                    <span>04. Aspectos Legales</span>
                  </div>
                  <p className={styles.megaMenuColDescription}>
                    Transparencia, privacidad y cumplimiento Google API:
                  </p>
                  <ul className={styles.megaMenuColListSans}>
                    <li>
                      <button onClick={handleOpenPrivacyPolicy} className={`${styles.megaMenuColLinkSans} !font-medium !text-sky-300/80 hover:!text-sky-300`}>
                        • Política de Privacidad
                      </button>
                    </li>
                    <li>
                      <button onClick={handleOpenTermsOfService} className={`${styles.megaMenuColLinkSans} !font-medium !text-sky-300/80 hover:!text-sky-300`}>
                        • Términos de Servicio
                      </button>
                    </li>
                    <li>
                      <button onClick={handleOpenCookiePolicy} className={`${styles.megaMenuColLinkSans} !font-normal !text-sky-300/80 hover:!text-sky-300`}>
                        • Política de Cookies
                      </button>
                    </li>
                    <li>
                      <button onClick={handleOpenGoogleDataPolicy} className={`${styles.megaMenuColLinkSans} !font-medium !text-pink-300/80 hover:!text-pink-300`}>
                        • Permisos Google API (Limited Use)
                      </button>
                    </li>
                    <li>
                      <button onClick={handleOpenLegalNotice} className={`${styles.megaMenuColLinkSans} !font-normal !text-sky-300/80 hover:!text-sky-300`}>
                        • Aviso Legal & Propiedad
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Col 5: Brand & Comunidad Fullstack Dev Lovers */}
                <div className={`${styles.megaMenuColumn} hover:border-emerald-500/30`}>
                  <div className={`${styles.megaMenuColTitle} text-emerald-400`}>
                    <Heart className="w-4 h-4" />
                    <span>05. Comunidad</span>
                  </div>
                  <p className={styles.megaMenuColDescription}>
                    Desarrollado para la comunidad universitaria de estudiantes:
                  </p>
                  <div className={styles.communityInfo}>
                    <a
                      href="https://fullstack-dev-lovers.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.communitySiteLink}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Sitio Oficial Dev Lovers</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <p className={styles.communityDescription}>
                      Copiloto Académico de Evaluación, Arquitectura & SonarQube.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Bottom Copyright & Badges */}
          <div className={styles.footerBottom}>
            <div>
              © 2026 Java Studio · Desarrollado para{' '}
              <a
                href="https://fullstack-dev-lovers.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                Fullstack Web Dev Lovers <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className={styles.footerBadges}>
              <span className={styles.footerBadge}>
                Entorno Seguro Auditoría Java II
              </span>
            </div>
          </div>

          {/* GIANT DISPLAY WORDMARK AT VERY BOTTOM */}
          <div className={styles.footerWordmarkContainer}>
            <span className={styles.footerWordmark}>
              Fullstack Dev Lovers
            </span>
          </div>

        </div>
      </footer>

      {/* FOOTER MODAL FOR LEGAL / BLOG / DOCUMENTATION */}
      {footerModalContent && (
        <div className={styles.footerModalBackdrop}>
          <div className={styles.footerModalContent}>
            
            {/* Modal Header */}
            <div className={styles.footerModalHeader}>
              <div>
                {footerModalContent.category && (
                  <span className={styles.footerModalCategory}>
                    {footerModalContent.category}
                  </span>
                )}
                <h3 className={styles.footerModalTitle}>
                  {footerModalContent.title}
                </h3>
              </div>
              <button
                onClick={() => setFooterModalContent(null)}
                className={styles.footerModalCloseButton}
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.footerModalBody}>
              {footerModalContent.content}
            </div>

            {/* Modal Footer */}
            <div className={styles.footerModalFooter}>
              <a
                href="https://fullstack-dev-lovers.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerModalLink}
              >
                Fullstack Web Dev Lovers <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setFooterModalContent(null)}
                className={styles.footerModalCloseButton2}
              >
                Cerrar Documento
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
