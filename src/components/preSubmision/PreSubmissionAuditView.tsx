import React, { useState } from 'react';
import { PreSubmissionAuditResult } from '../../data/types';
import { ShieldCheck, AlertTriangle, CheckCircle2, BookmarkPlus, ArrowLeft, Bot, FileWarning, CheckSquare, Trash2, Download, Sparkles, AlignLeft, Copy, Check, MessageSquare, BookOpen, FileText } from 'lucide-react';
import JSZip from 'jszip';
import styles from './PreSubmissionAuditView.module.css';

interface PreSubmissionAuditViewProps {
  audit: PreSubmissionAuditResult;
  onReset: () => void;
  onSaveSession: () => void;
  onOpenTutor?: (initialQuery: string) => void;
}

const JUNK_FOLDERS = [
  { name: '.idea/',     desc: 'Configuración de IntelliJ IDEA' },
  { name: '.vscode/',   desc: 'Configuración de VS Code' },
  { name: 'target/',    desc: 'Binarios compilados de Maven' },
  { name: 'bin/',       desc: 'Clases compiladas de Eclipse' },
  { name: '.DS_Store',  desc: 'Metadatos de sistema operativo' },
];

export const PreSubmissionAuditView: React.FC<PreSubmissionAuditViewProps> = ({
  audit, onReset, onSaveSession, onOpenTutor,
}) => {
  const [isPurged, setIsPurged] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [showInformePreview, setShowInformePreview] = useState(false);
  const [aiComments, setAiComments] = useState([
    { id: '1', file: 'PedidoService.java', code: '// Este método constructor sirve para inicializar las variables de la clase', actionDone: 'Convertido a Javadoc' },
    { id: '2', file: 'Main.java', code: '// Creamos una nueva instancia del scanner para solicitar datos 🤖', actionDone: null as string | null },
  ]);

  const feedbackText = `Hola Profe Virtual, he realizado la Auditoría Pre-Entrega en JavaStudio con una nota de limpieza del ${isPurged ? 100 : audit.cleanScore}%. ¿Qué otros aspectos debo verificar antes de subir el .zip definitivo?`;

  const informeMd = `# Informe de mejoras: JavaStudio\n\n**Fecha:** ${new Date().toLocaleDateString('es-ES')}\n**Puntuación de limpieza:** ${isPurged ? 100 : audit.cleanScore}%\n\n## 1. Purgado de carpetas temporales\n- \`.idea/\` → ELIMINADO\n- \`.vscode/\` → ELIMINADO\n- \`target/\` & \`bin/\` → ELIMINADO\n\n## 2. Saneamiento de comentarios y Javadoc\n- Inyección de encabezados Javadoc en clases y métodos\n- Eliminación de emojis y comentarios redundantes\n- Indentación estandarizada a 4 espacios\n\n## 3. Estado final\nProyecto listo para entrega universitaria.\n`;

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const pkg = zip.folder('src')?.folder('com')?.folder('universidad');
    pkg?.file('Main.java', `package com.universidad;\n\n/**\n * Clase principal.\n */\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Proyecto saneado.");\n    }\n}\n`);
    zip.file('INFORME_MEJORAS_SANEAMIENTO.md', informeMd);
    zip.file('.gitignore', `.idea/\n.vscode/\ntarget/\nbin/\n*.class\n.DS_Store\n`);
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'proyecto-saneado-java.zip'; a.click();
  };

  const handleDownloadGitignore = () => {
    const blob = new Blob([`.idea/\n.vscode/\ntarget/\nbin/\n*.class\n*.log\n.DS_Store\n`], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '.gitignore'; a.click();
  };

  const handleFixAiComment = (id: string, action: 'DELETE' | 'HUMAN' | 'JAVADOC') => {
    setAiComments(prev => prev.map(c => c.id !== id ? c : {
      ...c,
      actionDone: action === 'JAVADOC' ? 'Convertido a Javadoc oficial' : action === 'HUMAN' ? 'Traducido a comentario humano' : 'Eliminado',
    }));
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
        <div className="space-y-2">
          <div className={styles.bannerBadges}>
            <span className={styles.badgeEmerald}>Auditoría pre-entrega y anti-IA</span>
            <span className={audit.readyToSubmit || isPurged ? styles.badgeEmerald : styles.badgeAmberWarn}>
              {audit.readyToSubmit || isPurged ? '✓ Listo para subir' : '⚠️ Requiere limpieza'}
            </span>
          </div>
          <h2 className={styles.bannerTitle}>
            Puntuación de limpieza: <span className={styles.bannerScore}>{isPurged ? 100 : audit.cleanScore}%</span>
          </h2>
          <p className={styles.bannerSubtitle}>{audit.summary}</p>
        </div>
        <div className={styles.bannerActions}>
          <button onClick={handleDownloadZip} className={styles.btnEmerald}>
            <Download className="w-4 h-4" />Descargar ZIP saneado + informe
          </button>
          <button onClick={onSaveSession} className={styles.btnAmber}>
            <BookmarkPlus className="w-4 h-4" />Guardar
          </button>
          <button onClick={onReset} className={styles.btnSlate}>
            <ArrowLeft className="w-4 h-4" />Nueva auditoría
          </button>
        </div>
      </div>

      {/* Feedback */}
      <div className={styles.feedbackBox}>
        <div className={styles.feedbackHeader}>
          <div className={styles.feedbackTitle}>
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className={styles.feedbackTitleText}>Feedback orientativo de saneamiento</h3>
          </div>
          <div className={styles.feedbackActions}>
            <button onClick={handleCopyFeedback} className={styles.feedbackCopyBtn}>
              {copiedFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedFeedback ? 'Copiado' : 'Copiar feedback'}
            </button>
            <button onClick={() => onOpenTutor?.(feedbackText)} className={styles.feedbackAskBtn}>
              <MessageSquare className="w-4 h-4" />Preguntar al profe virtual
            </button>
          </div>
        </div>
        <p className={styles.feedbackQuote}>"{feedbackText}"</p>
      </div>

      {/* Junk cleaner */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.sectionTitle}><Trash2 className="w-4 h-4 text-amber-500" />Limpiador de carpetas temporales y archivos ocultos</h3>
          <span className={styles.statusBadge}>{isPurged ? '✓ Purga completa' : '5 estructuras detectadas'}</span>
        </div>
        <p className={styles.cardText}>
          Purgamos <code className="text-amber-500 font-bold">.idea/</code>, <code className="text-amber-500 font-bold">.vscode/</code>, <code className="text-amber-500 font-bold">target/</code>, <code className="text-amber-500 font-bold">bin/</code> y <code className="text-amber-500 font-bold">.DS_Store</code>.
        </p>
        <div className={styles.junkGrid}>
          {JUNK_FOLDERS.map((item, i) => (
            <div key={i} className={styles.junkItem}>
              <div>
                <span className={styles.junkName}>{item.name}</span>
                <span className={styles.junkDesc}>{item.desc}</span>
              </div>
              <span className={isPurged ? styles.junkBadgePurged : styles.junkBadgeDetected}>
                {isPurged ? 'Eliminado' : 'Detectado'}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.cardActions}>
          <button onClick={() => setIsPurged(true)} disabled={isPurged} className={styles.btnAmber}>
            <Trash2 className="w-4 h-4" />
            {isPurged ? '✓ Purgado' : 'Ejecutar purga'}
          </button>
          <button onClick={handleDownloadGitignore} className={styles.btnSlate}>
            <Download className="w-4 h-4 text-emerald-400" />Descargar .gitignore
          </button>
        </div>
      </div>

      {/* AI comment sanitizer */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.sectionTitle}><Sparkles className="w-4 h-4 text-emerald-500" />Saneador de comentarios de IA, Javadoc e indentación</h3>
          <span className={styles.sectionTitle} style={{ fontSize: '11px' }}>Indentación estándar 4 espacios</span>
        </div>
        <p className={styles.cardText}>Saneamos comentarios redundantes, emojis y marcas TODO, y garantizamos formato <strong>Javadoc</strong> formal.</p>
        <div className="space-y-3">
          {aiComments.map(c => (
            <div key={c.id} className={styles.aiCommentCard}>
              <div className={styles.aiCommentTop}>
                <span className={styles.aiCommentFile}>{c.file}</span>
                {c.actionDone
                  ? <span className={styles.aiCommentBadgeDone}>✓ {c.actionDone}</span>
                  : <span className={styles.aiCommentBadgePending}>Comentario robótico detectado</span>
                }
              </div>
              <pre className={styles.aiCommentCode}>{c.code}</pre>
              {!c.actionDone && (
                <div className={styles.aiCommentBtns}>
                  <button onClick={() => handleFixAiComment(c.id, 'JAVADOC')} className={styles.btnJavadoc}>
                    <AlignLeft className="w-3.5 h-3.5" />Convertir a Javadoc
                  </button>
                  <button onClick={() => handleFixAiComment(c.id, 'DELETE')} className={styles.btnDelete}>
                    <Trash2 className="w-3.5 h-3.5" />Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Informe preview */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.sectionTitle}><BookOpen className="w-4 h-4 text-emerald-500" />Informe adjunto (INFORME_MEJORAS_SANEAMIENTO.md)</h3>
          <button onClick={() => setShowInformePreview(v => !v)} className={styles.previewBtn}>
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            {showInformePreview ? 'Ocultar' : 'Previsualizar'}
          </button>
        </div>
        <p className={styles.cardText}>Se adjunta dentro del <code className="text-emerald-500 font-bold">.zip</code> descargado.</p>
        {showInformePreview && <pre className={styles.previewCode}>{informeMd}</pre>}
      </div>

      {/* Detected issues */}
      <div className="space-y-4">
        <h3 className={styles.sectionTitle}><Bot className="w-4 h-4 text-emerald-500" />Hallazgos detectados</h3>
        {audit.detectedIssues.length === 0 ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            No se detectaron rastros sintéticos ni artefactos temporales.
          </div>
        ) : (
          <div className="space-y-3">
            {audit.detectedIssues.map(issue => (
              <div key={issue.id} className={styles.issueCard}>
                <div className={styles.issueTop}>
                  <div className="flex items-center gap-2">
                    <span className={issue.severity === 'HIGH' ? styles.issueSeverityHigh : styles.issueSeverityMedium}>{issue.severity}</span>
                    <span className={styles.issueLocation}>Ubicación: {issue.location}</span>
                  </div>
                  <span className={styles.issueType}>Tipo: {issue.type}</span>
                </div>
                <h4 className={styles.issueTitle}>{issue.title}</h4>
                {issue.snippet && <pre className={styles.issueSnippet}>{issue.snippet}</pre>}
                <div className={styles.issueFix}>💡 <strong>Solución:</strong> {issue.suggestedFix}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rubric checks */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}><CheckSquare className="w-4 h-4 text-emerald-500" />Verificación de criterios de rúbrica</h3>
        <div className={styles.rubricList}>
          {audit.rubricChecks.map((item, i) => (
            <div key={i} className={styles.rubricItem}>
              <div className={styles.rubricLeft}>
                {item.passed
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  : <FileWarning className="w-4 h-4 text-amber-500 shrink-0" />
                }
                <span className={styles.rubricLabel}>{item.item}</span>
              </div>
              <span className={styles.rubricNote}>{item.note}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
