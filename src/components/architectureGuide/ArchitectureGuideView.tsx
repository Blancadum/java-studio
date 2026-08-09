import React, { useState } from 'react';
import { ArchitectureGuideResult } from '../../data/types';
import { Compass, Layers, CheckCircle2, ListOrdered, BookmarkPlus, ArrowLeft, Download, AlertTriangle, Sparkles, Copy, Check, MessageSquare, BookOpen, FileText } from 'lucide-react';
import JSZip from 'jszip';
import styles from './ArchitectureGuideView.module.css';

interface ArchitectureGuideViewProps {
  guide: ArchitectureGuideResult;
  onReset: () => void;
  onSaveSession: () => void;
  onOpenTutor?: (initialQuery: string) => void;
}

const SEMANTIC_TOKENS = [
  { word: 'Biblioteca',       category: 'CLASS',     color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  { word: 'Libro',            category: 'CLASS',     color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  { word: 'UsuarioEstudiante',category: 'CLASS',     color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  { word: 'isbn',             category: 'ATTRIBUTE', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  { word: 'titulo',           category: 'ATTRIBUTE', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  { word: 'autor',            category: 'ATTRIBUTE', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  { word: 'prestarLibro',     category: 'METHOD',    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  { word: 'devolverLibro',    category: 'METHOD',    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' },
];

export const ArchitectureGuideView: React.FC<ArchitectureGuideViewProps> = ({
  guide, onReset, onSaveSession, onOpenTutor,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [showMdPreview, setShowMdPreview] = useState(false);

  const feedbackText = `Hola Profe Virtual, he revisado la Guía de Arquitectura del proyecto "${guide.projectName}". Me gustaría profundizar en cómo estructurar las clases (${guide.recommendedClasses.map(c => c.className).join(', ')}) y entender mejor el paso a paso del enunciado.`;

  const explanationMd = `# Guía didáctica: ${guide.projectName}\n\n## 1. POO aplicada\nEncapsulamiento, abstracción, manejo de excepciones.\n\n## 2. Desglose arquitectónico\n${guide.recommendedClasses.map(c => `### \`${c.className}\` (${c.type.toUpperCase()})\n- Paquete: \`${c.packagePath}\`\n- Propósito: ${c.purpose}\n- Atributos: ${c.suggestedAttributes.join(', ')}\n- Métodos: ${c.keyMethods.join(', ')}\n`).join('\n')}\n## 3. Hoja de ruta\n${guide.roadmapSteps.map(s => `${s.stepNumber}. **${s.title}** (\`${s.targetClass}\`): ${s.description}\n   *Consejo*: ${s.tips}`).join('\n')}\n`;

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const pkg = zip.folder('src')?.folder('com')?.folder('javastudio');
    guide.recommendedClasses.forEach(item => {
      const attrs = item.suggestedAttributes.map(a => `    private String ${a};`).join('\n');
      const methods = item.keyMethods.map(m => `    public void ${m.split('(')[0].trim()}() {\n        // TODO: Implementar\n    }`).join('\n\n');
      pkg?.file(`${item.className}.java`, `package com.javastudio.${item.packagePath};\n\n/** ${item.purpose} */\npublic ${item.type.toLowerCase()} ${item.className} {\n\n${attrs}\n\n    public ${item.className}() {}\n\n${methods}\n}\n`);
    });
    zip.file('EXPLICACION_PASO_A_PASO.md', explanationMd);
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${guide.projectName.toLowerCase().replace(/\s+/g, '-')}-esqueleto.zip`;
    a.click();
  };

  const handleCopySkeleton = (idx: number, name: string) => {
    const item = guide.recommendedClasses[idx];
    const attrs = item.suggestedAttributes.map(a => `    private String ${a};`).join('\n');
    const methods = item.keyMethods.map(m => `    public void ${m.split('(')[0].trim()}() {\n        // TODO\n    }`).join('\n\n');
    navigator.clipboard.writeText(`public class ${name} {\n${attrs}\n\n${methods}\n}`);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyFeedback = () => {
    navigator.clipboard.writeText(feedbackText);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  return (
    <div className={styles.container}>

      {/* Banner */}
      <div className={styles.banner}>
        <div className="space-y-1">
          <div className={styles.bannerBadges}>
            <span className={styles.badgeIndigo}>Guía de arquitectura POO</span>
            <span className={styles.badgeAmber}>{guide.architectureType}</span>
          </div>
          <h2 className={styles.bannerTitle}>{guide.projectName}</h2>
          <p className={styles.bannerSubtitle}>{guide.summary}</p>
        </div>
        <div className={styles.bannerActions}>
          <button onClick={handleDownloadZip} className={styles.btnAmber}>
            <Download className="w-4 h-4" />Descargar esqueleto base (.zip)
          </button>
          <button onClick={onSaveSession} className={styles.btnSlate}>
            <BookmarkPlus className="w-4 h-4" />Guardar en mi perfil
          </button>
          <button onClick={onReset} className={styles.btnSlateGhost}>
            <ArrowLeft className="w-4 h-4" />Nuevo
          </button>
        </div>
      </div>

      {/* Feedback */}
      <div className={styles.feedbackBox}>
        <div className={styles.feedbackHeader}>
          <div className={styles.feedbackTitle}>
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className={styles.feedbackTitleText}>Feedback orientativo del tutor virtual</h3>
          </div>
          <div className={styles.feedbackActions}>
            <button onClick={handleCopyFeedback} className={styles.feedbackCopyBtn}>
              {copiedFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedFeedback ? 'Copiado' : 'Copiar'}
            </button>
            <button onClick={() => onOpenTutor?.(feedbackText)} className={styles.feedbackAskBtn}>
              <MessageSquare className="w-4 h-4" />Preguntar al profe virtual
            </button>
          </div>
        </div>
        <p className={styles.feedbackQuote}>"{feedbackText}"</p>
      </div>

      {/* Semantic analyzer */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.sectionTitle}><Sparkles className="w-4 h-4 text-indigo-500" />Analizador semántico de requisitos</h3>
          <span className={styles.sectionSubtitle}>Conceptos del enunciado</span>
        </div>
        <div className={styles.legendRow}>
          <div className={styles.legendEmerald}><div className={`${styles.legendDot} bg-emerald-500`} />Verde = Clase</div>
          <div className={styles.legendBlue}><div className={`${styles.legendDot} bg-blue-500`} />Azul = Atributo</div>
          <div className={styles.legendAmber}><div className={`${styles.legendDot} bg-amber-500`} />Naranja = Método</div>
        </div>
        <div className={styles.tokensArea}>
          {SEMANTIC_TOKENS.map((t, i) => (
            <span key={i} className={`px-2.5 py-1 rounded-lg border font-semibold ${t.color}`}>{t.word}</span>
          ))}
        </div>
      </div>

      {/* Md preview */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.sectionTitle}><BookOpen className="w-4 h-4 text-indigo-500" />Documento didáctico de apoyo</h3>
          <button onClick={() => setShowMdPreview(v => !v)} className={styles.previewBtn}>
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            {showMdPreview ? 'Ocultar' : 'Previsualizar .md'}
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Este informe se incluirá dentro del paquete <code className="text-indigo-500 font-bold">.zip</code>.
        </p>
        {showMdPreview && <pre className={styles.previewCode}>{explanationMd}</pre>}
      </div>

      {/* Anti-cheat warning */}
      <div className={styles.warning}>
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className={styles.warningText}>
          <strong className={styles.warningTitle}>Nota académica importante</strong>
          JavaStudio no te da la tarea resuelta. Recibirás plantillas limpias para que escribas la lógica dentro de los métodos.
        </div>
      </div>

      {/* Classes grid */}
      <div className="space-y-4">
        <h3 className={styles.sectionTitle}><Layers className="w-4 h-4 text-indigo-500" />1. Estructura de clases, interfaces y excepciones</h3>
        <div className={styles.classesGrid}>
          {guide.recommendedClasses.map((item, idx) => (
            <div key={idx} className={styles.classCard}>
              <div className="space-y-2">
                <div className={styles.classCardTop}>
                  <span className={styles.classPkg}>{item.packagePath}</span>
                  <span className={styles.classType}>{item.type}</span>
                </div>
                <h4 className={styles.className}>
                  <span>{item.className}.java</span>
                  <button onClick={() => handleCopySkeleton(idx, item.className)} className={styles.classCopyBtn} title="Copiar plantilla">
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </h4>
                <p className={styles.classPurpose}>{item.purpose}</p>
              </div>
              <div className={styles.classFooter}>
                <div>
                  <span className={styles.classFooterLabel}>Métodos clave:</span>
                  <div className={styles.methodTags}>
                    {item.keyMethods.map((m, i) => <span key={i} className={styles.methodTag}>{m}</span>)}
                  </div>
                </div>
                {item.suggestedAttributes.length > 0 && (
                  <div>
                    <span className={styles.classFooterLabel}>Atributos (`private`):</span>
                    <p className={styles.attrText}>{item.suggestedAttributes.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}><ListOrdered className="w-4 h-4 text-amber-500" />2. Hoja de ruta paso a paso</h3>
        <div className={styles.roadmapList}>
          {guide.roadmapSteps.map(step => (
            <div key={step.stepNumber} className={styles.roadmapStep}>
              <div className={styles.roadmapNum}>{step.stepNumber}</div>
              <h4 className={styles.roadmapTitle}>
                {step.title}
                <span className={styles.roadmapTargetBadge}>Clase: {step.targetClass}</span>
              </h4>
              <p className={styles.roadmapDesc}>{step.description}</p>
              <div className={styles.roadmapTip}>💡 <strong>Consejo:</strong> {step.tips}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Concept checklist */}
      <div className={styles.conceptsPanel}>
        <h3 className={styles.conceptsTitle}><CheckCircle2 className="w-4 h-4" />3. Conceptos clave a revisar</h3>
        <div className={styles.conceptsGrid}>
          {guide.conceptChecklist.map((c, i) => (
            <div key={i} className={styles.conceptItem}>
              <div className={styles.conceptDot} />{c}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
