import React, { useState } from 'react';
import { Bot, Sparkles, X, ArrowRight, FileText, Compass, ShieldCheck, Award, MessageSquare } from 'lucide-react';
import { StudentPersonaMode } from '../../data/types';
import styles from './JavaBotOnboardingWidget.module.css';

interface JavaBotOnboardingWidgetProps {
  activeMode: StudentPersonaMode;
  onSelectMode: (mode: StudentPersonaMode) => void;
  onOpenTutorWithQuery?: (query: string) => void;
}

export const JavaBotOnboardingWidget: React.FC<JavaBotOnboardingWidgetProps> = ({
  activeMode,
  onSelectMode,
  onOpenTutorWithQuery,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  const handleCTA = (mode: StudentPersonaMode, query: string) => {
    onSelectMode(mode);
    setIsOpen(false);
    onOpenTutorWithQuery?.(query);
  };

  return (
    <div className={styles.wrapper}>
      {isOpen && (
        <div className={styles.panel}>

          <div className={styles.panelHeader}>
            <div className="flex items-center gap-2.5">
              <div className={styles.botIcon}><Bot className="w-5 h-5" /></div>
              <div>
                <h3 className={styles.panelTitle}>
                  JavaBot <span className={styles.panelTitleBadge}>Tutor Virtual</span>
                </h3>
                <p className={styles.panelSubtitle}>Router inteligente de modos</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className={styles.closeBtn}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className={styles.body}>
            <div className={styles.welcomeBubble}>
              <div className={styles.welcomeIcon}><Sparkles className="w-4 h-4" /></div>
              <div className={styles.welcomeMsg}>
                <p>¡Hola! 👋 Soy <strong>JavaBot</strong>. Estoy aquí para guiarte al modo de trabajo idóneo.</p>
                <p className="font-semibold text-amber-300">¿En qué fase de tu práctica te encuentras?</p>
              </div>
            </div>

            {!selectedRoute ? (
              <div className="space-y-2 pt-1">
                <button type="button" onClick={() => setSelectedRoute('A')} className={`${styles.routeBtn} ${styles.routeBtnIndigo}`}>
                  <div className={styles.routeIconIndigo}><Compass className="w-4 h-4" /></div>
                  <div>
                    <span className={styles.routeLabelIndigo}>📝 Opción A: Inicio / Noob</span>
                    <p className={styles.routeDesc}>Tengo el enunciado pero no sé cómo diseñar las clases.</p>
                  </div>
                </button>
                <button type="button" onClick={() => setSelectedRoute('B')} className={`${styles.routeBtn} ${styles.routeBtnEmerald}`}>
                  <div className={styles.routeIconEmerald}><ShieldCheck className="w-4 h-4" /></div>
                  <div>
                    <span className={styles.routeLabelEmerald}>🛡️ Opción B: Pre-entrega y anti-IA</span>
                    <p className={styles.routeDesc}>Ya escribí el código, quiero asegurarme de que esté limpio.</p>
                  </div>
                </button>
                <button type="button" onClick={() => setSelectedRoute('C')} className={`${styles.routeBtn} ${styles.routeBtnAmber}`}>
                  <div className={styles.routeIconAmber}><FileText className="w-4 h-4" /></div>
                  <div>
                    <span className={styles.routeLabelAmber}>🚀 Opción C: Post-corrección</span>
                    <p className={styles.routeDesc}>Tengo observaciones de la profesora que quiero arreglar.</p>
                  </div>
                </button>
                <button type="button" onClick={() => setSelectedRoute('D')} className={`${styles.routeBtn} ${styles.routeBtnSky}`}>
                  <div className={styles.routeIconSky}><Award className="w-4 h-4" /></div>
                  <div>
                    <span className={styles.routeLabelSky}>📊 Opción D: Calidad SonarQube y SOLID</span>
                    <p className={styles.routeDesc}>Quiero auditar mi código y generar pruebas JUnit 5.</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {selectedRoute === 'A' && (
                  <div className={styles.detailBoxIndigo}>
                    <div className={styles.detailTitleIndigo}><Compass className="w-4 h-4" />Ruta A: Guía POO</div>
                    <p className="text-[11px] leading-relaxed">Pegas el enunciado y generamos el esqueleto de clases con guías <code className="bg-indigo-900/60 px-1 rounded">// TODO</code>.</p>
                    <button onClick={() => handleCTA('ARCHITECTURE_NOOB', 'Hola JavaBot, quiero diseñar el esqueleto POO de mi enunciado.')} className={styles.ctaIndigo}>
                      🎯 Diseñar esqueleto POO <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {selectedRoute === 'B' && (
                  <div className={styles.detailBoxEmerald}>
                    <div className={styles.detailTitleEmerald}><ShieldCheck className="w-4 h-4" />Ruta B: Pre-entrega y anti-IA</div>
                    <p className="text-[11px] leading-relaxed">Purgamos carpetas basura (<code className="bg-emerald-900/60 px-1 rounded">.idea/</code>, <code className="bg-emerald-900/60 px-1 rounded">target/</code>) y desinfectamos comentarios.</p>
                    <button onClick={() => handleCTA('PRE_SUBMISSION_AUDIT', 'Hola JavaBot, quiero escanear la higiene de mi proyecto.')} className={styles.ctaEmerald}>
                      🧹 Purgar y sanitizar <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {selectedRoute === 'C' && (
                  <div className={styles.detailBoxAmber}>
                    <div className={styles.detailTitleAmber}><FileText className="w-4 h-4" />Ruta C: Subsanación de feedback</div>
                    <p className="text-[11px] leading-relaxed">Comparamos tu código con las observaciones en Diff-View para refactorizar y aprobar.</p>
                    <button onClick={() => handleCTA('FEEDBACK_REVISION', 'Hola JavaBot, quiero subsanar los comentarios de la profesora.')} className={styles.ctaAmber}>
                      🛠️ Corregir feedback <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {selectedRoute === 'D' && (
                  <div className={styles.detailBoxSky}>
                    <div className={styles.detailTitleSky}><Award className="w-4 h-4" />Ruta D: SonarQube y SOLID</div>
                    <p className="text-[11px] leading-relaxed">Quality Gate, complejidad cognitiva S3776, Quick-Fixes y suites JUnit 5.</p>
                    <button onClick={() => handleCTA('SONAR_QUALITY', 'Hola JavaBot, quiero realizar una auditoría SonarQube.')} className={styles.ctaSky}>
                      📊 Auditoría SonarQube <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button onClick={() => setSelectedRoute(null)} className={styles.backBtn}>← Ver otras opciones</button>
              </div>
            )}
          </div>

          <div className={styles.footerBar}>
            <span>Modo activo: <strong className="text-amber-400">{activeMode}</strong></span>
            <button onClick={() => onOpenTutorWithQuery?.('Hola JavaBot, necesito ayuda con Java Studio.')} className={styles.footerChatBtn}>
              <MessageSquare className="w-3 h-3" /> Abrir chat completo
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className={styles.fab} title="JavaBot: Asistente Virtual">
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className={styles.pingOuter} />
          <span className={styles.pingInner} />
        </div>
        <span className={styles.fabLabel}>¿Dudas? Habla con <strong>JavaBot</strong></span>
      </button>
    </div>
  );
};
