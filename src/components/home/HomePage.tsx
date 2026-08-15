import React, { useRef } from 'react';
import { BookOpen, Code, Zap, Github, Mail, Lightbulb, Target, Users, ArrowRight, Sparkles, Rocket, Layout, Code2 } from 'lucide-react';
import styles from './HomePage.module.css';

interface HomePageProps {
  onOpenAuth?: () => void;
  onGoToCampus?: () => void;
  isAuthenticated?: boolean;
  onShowDocs?: () => void;
  onShowGuide?: () => void;
  onShowPatterns?: () => void;
  onShowPricing?: () => void;
  onShowModalities?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onOpenAuth, 
  onGoToCampus, 
  isAuthenticated = false,
  onShowDocs,
  onShowGuide,
  onShowPatterns,
  onShowPricing,
  onShowModalities
}) => {
  const guideRef = useRef<HTMLDivElement>(null);

  const scrollToGuide = () => {
    guideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles className="w-4 h-4" />
            <span>IA para estudiantes de Java</span>
          </div>

          <h1 className={styles.heroTitle}>
            Eleva tu código Java
            <span className={styles.gradient}> a nivel profesional</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Análisis inteligente de proyectos OOP con feedback estructurado y recomendaciones en código.
          </p>

          <div className={styles.heroButtons}>
            {/* TODO: Descomentar cuando se implemente autenticación */}
            {/* {!isAuthenticated && (
              <button onClick={onOpenAuth} className={styles.ctaButton}>
                Comenzar ahora
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {isAuthenticated && onShowModalities && ( */}
              <button onClick={onShowModalities} className={styles.ctaButton}>
                Comenzar ahora
                <ArrowRight className="w-4 h-4" />
              </button>
            {/* )} */}
            <button onClick={scrollToGuide} className={styles.secondaryButton}>
              Conocer más
            </button>
          </div>
        </div>
        <div className={styles.heroDecor} />
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>4</div>
          <div className={styles.statLabel}>Modalidades de análisis</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>100%</div>
          <div className={styles.statLabel}>Feedback personalizado</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>∞</div>
          <div className={styles.statLabel}>Intentos sin límite</div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Cuatro formas de mejorar</h2>
          <p className={styles.featuresSubtitle}>Cada modalidad se adapta a tu etapa en el desarrollo</p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ backgroundColor: '#f0f0f0' }}>
              <Code className="w-6 h-6 text-black" />
            </div>
            <h3>Desde cero</h3>
            <p>Estructura y arquitectura de proyectos Java II con patrones de diseño y buenas prácticas.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ backgroundColor: '#f0f0f0' }}>
              <Target className="w-6 h-6 text-black" />
            </div>
            <h3>Antes de entregar</h3>
            <p>Auditoría completa: limpieza de código, rúbrica y validación de requisitos.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ backgroundColor: '#f0f0f0' }}>
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <h3>Corregir con feedback</h3>
            <p>Mejora tu código basándote en la retroalimentación de tu profesor o entregas anteriores.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ backgroundColor: '#f0f0f0' }}>
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h3>Buenas prácticas</h3>
            <p>Análisis SonarQube: métricas de calidad, SOLID principles y complejidad ciclomática.</p>
          </div>
        </div>

        <div className={styles.featureCTA}>
          {/* TODO: Descomentar cuando se implemente autenticación */}
          {/* {!isAuthenticated ? (
            <button onClick={onOpenAuth} className={styles.featureCTAButton}>
              Comenzar análisis
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : ( */}
            <button onClick={onShowModalities} className={styles.featureCTAButton}>
              Ir a modalidades
              <ArrowRight className="w-4 h-4" />
            </button>
          {/* )} */}
        </div>
      </section>

      {/* Value Section */}
      <section className={styles.valueSection}>
        <div className={styles.valueContent}>
          <h2>¿Por qué Java Studio?</h2>
          <div className={styles.valueGrid}>
            <div className={styles.valueItem}>
              <Users className="w-5 h-5 text-black" />
              <div>
                <h4>Diseñado para estudiantes</h4>
                <p>Explicitamente creado para las prácticas de Java II/OOP</p>
              </div>
            </div>
            <div className={styles.valueItem}>
              <Lightbulb className="w-5 h-5 text-black" />
              <div>
                <h4>IA educativa</h4>
                <p>Explicaciones claras que te enseñan, no solo soluciones</p>
              </div>
            </div>
            <div className={styles.valueItem}>
              <Code className="w-5 h-5 text-black" />
              <div>
                <h4>Código en contexto</h4>
                <p>Propuestas de mejora con ejemplos ejecutables</p>
              </div>
            </div>
            <div className={styles.valueItem}>
              <Zap className="w-5 h-5 text-black" />
              <div>
                <h4>Retroalimentación inmediata</h4>
                <p>Análisis al instante, sin esperar a tu profesor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section - Cómo usar Java Studio */}
      <section className={styles.guideSection} ref={guideRef}>
        <div className={styles.guideHeader}>
          <h2>Cómo usar Java Studio en 5 pasos</h2>
          <p>Proceso simple y directo para obtener feedback de tu código</p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Crea tu cuenta</h3>
              <p>
                Haz clic en "Acceder" para crear una cuenta gratuita. Usa tu correo institucional 
                o personal. La autenticación es instantánea y segura.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Selecciona una modalidad</h3>
              <p>
                Elige entre 4 modalidades según tus necesidades: desde cero, antes de entregar, 
                corregir con feedback o buenas prácticas. Cada una tiene objetivos específicos.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Carga tus archivos</h3>
              <p>
                Importa tus archivos Java desde Google Drive o sube manualmente. Incluye el 
                enunciado de la práctica y el feedback de tu profesor si aplica.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3>Ejecuta el análisis</h3>
              <p>
                Haz clic en "Analizar" y espera a que la IA procese tu código. Los análisis 
                generalmente toman entre 30-60 segundos dependiendo del tamaño del proyecto.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h3>Revisa los resultados</h3>
              <p>
                Explora el análisis detallado con métricas, sugerencias de código y explicaciones. 
                Puedes hacer clic en cada recomendación para ver propuestas de mejora.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.tipsGrid}>
          <div className={styles.tip}>
            <Lightbulb className="w-6 h-6 text-black" />
            <div>
              <h4>Incluye el enunciado</h4>
              <p>Proporciona el PDF o texto del enunciado para análisis más precisos.</p>
            </div>
          </div>
          <div className={styles.tip}>
            <Code2 className="w-6 h-6 text-black" />
            <div>
              <h4>Código compilable</h4>
              <p>Asegúrate de que tu código compile sin errores para mejores resultados.</p>
            </div>
          </div>
          <div className={styles.tip}>
            <Layout className="w-6 h-6 text-black" />
            <div>
              <h4>Estructura clara</h4>
              <p>Mantén una estructura de carpetas coherente (package names, etc).</p>
            </div>
          </div>
          <div className={styles.tip}>
            <Rocket className="w-6 h-6 text-black" />
            <div>
              <h4>Itera</h4>
              <p>Puedes analizar el mismo proyecto varias veces. Aplica cambios y vuelve a analizar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaSectionTitle}>¿Listo para mejorar tu código?</h2>
        <p className={styles.ctaSectionText}>
          Únete a cientos de estudiantes que ya mejoran sus habilidades con Java Studio
        </p>
        {!isAuthenticated && (
          <button onClick={onOpenAuth} className={styles.ctaSectionButton}>
            Crear cuenta gratis
          </button>
        )}
        {isAuthenticated && onGoToCampus && (
          <button onClick={onGoToCampus} className={styles.ctaSectionButton}>
            Ir al Campus
          </button>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Producto</h4>
            <ul>
              <li><button onClick={scrollToGuide} className={styles.footerLink}>Características</button></li>
              <li><button onClick={onShowPricing} className={styles.footerLink}>Precios</button></li>
              <li><button onClick={scrollToGuide} className={styles.footerLink}>Roadmap</button></li>
              <li><button onClick={onShowDocs} className={styles.footerLink}>Changelog</button></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Aprende</h4>
            <ul>
              <li><button onClick={onShowDocs} className={styles.footerLink}>Documentación</button></li>
              <li><button onClick={scrollToGuide} className={styles.footerLink}>Guía de inicio</button></li>
              <li><button onClick={onShowPatterns} className={styles.footerLink}>Patrones de diseño</button></li>
              <li><button onClick={onShowDocs} className={styles.footerLink}>Preguntas frecuentes</button></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Comunidad</h4>
            <ul>
              <li><a href="#forum" className={styles.footerLink}>Foro</a></li>
              <li><a href="#discord" className={styles.footerLink}>Discord</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>GitHub</a></li>
              <li><a href="#twitter" className={styles.footerLink}>Twitter</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Sobre</h4>
            <ul>
              <li><button onClick={scrollToGuide} className={styles.footerLink}>Acerca de</button></li>
              <li><a href="mailto:info@javastudio.dev" className={styles.footerLink}>Contacto</a></li>
              <li><a href="#privacy" className={styles.footerLink}>Privacidad</a></li>
              <li><a href="#terms" className={styles.footerLink}>Términos</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2026 Java Studio. Creado para estudiantes de Java II/OOP.</p>
          <div className={styles.footerSocial}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github className="w-4 h-4" /></a>
            <a href="mailto:info@javastudio.dev" aria-label="Email"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};
