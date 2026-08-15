import React, { useState } from 'react';
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
import { JavaFile, StudentPersonaMode } from '../data/types';
import { Reveal } from '../components/reveal/Reveal';
import { ChipButton } from '../components/chipbutton/ChipButton';
import styles from './HomePage.module.css';
import { FAQ_DATA } from '../data/constants';

import { MODES_CONFIG } from '../data/modes';
import { Campus } from '../components/home/Campus';

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
  userProfile?: any | null;
  onOpenProfile?: () => void;
  driveConnected?: boolean;
  onConnectDrive?: () => void;
  onLoadSession?: (session: any) => void;
  onOpenDemo?: () => void;
}

export const HomePage: React.FC<HomeProps> = ({
  activeMode,
  onSelectMode,
  onStartAnalysis,
  onOpenDriveModal,
  onLoadSample,
  isAnalyzing,
  onOpenAuth,
  onOpenTutorWithQuery,
  userProfile,
  onOpenProfile,
  driveConnected,
  onConnectDrive,
  onLoadSession,
  onOpenDemo,
}) => {
  // Si el usuario está autenticado, mostrar el Campus
  if (userProfile) {
    return (
      <Campus
        user={userProfile}
        activeMode={activeMode}
        onSelectMode={onSelectMode}
        onOpenDriveModal={onOpenDriveModal}
        onLoadSample={onLoadSample}
        onOpenProfile={onOpenProfile}
        driveConnected={driveConnected}
        onConnectDrive={onConnectDrive}
        onOpenTutorWithQuery={onOpenTutorWithQuery}
        onStartAnalysis={onStartAnalysis}
        onLoadSession={onLoadSession}
      />
    );
  }

  // FAQ Toggle
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  return (
    <div className={styles.container}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />
        <div className={styles.heroGlow3} />

        <div className={styles.heroContent}>
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

          <Reveal delay={260}>
            <p className={styles.subtitle}>
              Analiza tus entregas antes de pulsar enviar: detecta fallos de arquitectura POO, limpia comentarios sospechosos de IA y asegúrate de que cumple con las buenas prácticas.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className={styles.heroActions}>
              <ChipButton variant="yellow" onClick={onOpenAuth}>
                Crear cuenta gratis →
              </ChipButton>
              <ChipButton variant="ghost" onClick={onOpenDemo}>
                Demo →
              </ChipButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. FEATURES / MODES SECTION */}
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
            Cada modo activa un motor de IA especializado para tu evaluación.
          </p>
        </div>

        <div className={styles.modesGrid}>
          {MODES_CONFIG.map((mode, i) => (
            <Reveal key={mode.id} delay={i * 80}>
              <div
                onClick={() => onSelectMode(mode.id)}
                className={`${styles.modeCard} ${
                  activeMode === mode.id ? styles.active : styles.inactive
                } cursor-pointer hover:shadow-lg transition-shadow`}
              >
                <div className={styles.modeCardHeader}>
                  <div className={`${styles.modeCardIconContainer} text-${mode.colorClass}-600`}>
                    {mode.icon}
                  </div>
                </div>
                
                <div>
                  <h3 className={styles.modeCardTitle}>{mode.title}</h3>
                </div>

                <p className={styles.modeCardDescription}>{mode.desc}</p>

                <div className={styles.modeCardAction}>
                  <span>Explorar</span>
                  <ArrowRight className={styles.modeCardArrow} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. TESTIMONIAL SECTION */}
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

      {/* 4. FAQ SECTION */}
      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <div>
            <span className={`${styles.sectionEyebrow} block mb-1`}>
              ▪ PREGUNTAS FRECUENTES
            </span>
            <h3 className={styles.faqTitle}>
              Preguntas Frecuentes
            </h3>
          </div>

          {onOpenTutorWithQuery && (
            <button
              onClick={() => onOpenTutorWithQuery(`Tengo dudas sobre cómo funciona Java Studio`)}
              className={styles.faqAskButton}
            >
              <Bot className="w-3.5 h-3.5 text-amber-700" />
              <span>Preguntar a Profe Virtual</span>
            </button>
          )}
        </div>

        <div className={styles.faqAccordion}>
          {FAQ_DATA.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div key={idx} className={styles.faqItem}>
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className={styles.faqQuestion}
                >
                  <span className={styles.faqQuestionContent}>
                    <span className={styles.faqNumber}>{idx + 1}</span>
                    {faq.q}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className={`${styles.faqChevron} text-sky-700`} />
                  ) : (
                    <ChevronDown className={`${styles.faqChevron} text-slate-400`} />
                  )}
                </button>

                {isExpanded && (
                  <div className={styles.faqAnswer}>{faq.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className={styles.finalCtaSection}>
        <Reveal delay={0}>
          <div className={styles.finalCtaBadge}>
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Impulsado por Fullstack Web Dev Lovers</span>
          </div>
          <h2 className={styles.finalCtaTitle}>
            ¿Listo para explorar los 4 Modos Académicos?
          </h2>
          <p className={styles.finalCtaSubtitle}>
            Elige el modo que mejor se adapte a tu necesidad actual.
          </p>
          <div className={styles.finalCtaActions}>
            <ChipButton variant="yellow" onClick={onLoadSample}>
              Probar Demo Gratis
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

      {/* 6. FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerGlow1} />
        <div className={styles.footerGlow2} />

        <div className={styles.footerContent}>
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

          <div className={styles.footerWordmarkContainer}>
            <span className={styles.footerWordmark}>
              Fullstack Dev Lovers
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
