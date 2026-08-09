import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, X, Sparkles, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { JavaFile, AnalysisResult } from '../../data/types';
import styles from './ExportModal.module.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposedFiles: JavaFile[];
  analysis: AnalysisResult | null;
  teacherDoc: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen, onClose, proposedFiles, analysis, teacherDoc,
}) => {
  const [exportingZip, setExportingZip] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  if (!isOpen) return null;

  const generateReport = () => {
    let r = `# Memoria de subsanación y mejoras — Java II\n`;
    r += `**Fecha:** ${new Date().toLocaleDateString('es-ES')}\n\n---\n\n`;
    r += `## 1. Resumen ejecutivo\n${analysis?.summary || ''}\n\n`;
    r += `## 2. Cumplimiento de indicaciones\n\n`;
    analysis?.recommendations.forEach((rec, i) => {
      r += `### ${i + 1}. ${rec.title}\n- **Estado:** Cumplido\n- **Descripción:** ${rec.description}\n`;
      if (rec.teacherNote) r += `- **Observación:** "${rec.teacherNote}"\n`;
      r += '\n';
    });
    r += `## 3. Propuestas aplicadas\n\n`;
    analysis?.proposals.forEach((p, i) => {
      r += `### 3.${i + 1} ${p.issueTitle} (${p.fileTarget})\n${p.description}\n\n**Justificación:** ${p.explanation}\n\n\`\`\`java\n${p.proposedCode}\n\`\`\`\n\n`;
    });
    return r;
  };

  const handleDownloadZip = async () => {
    setExportingZip(true);
    try {
      const zip = new JSZip();
      proposedFiles.forEach(f => zip.file(f.path || f.name, f.content));
      zip.file('Informe_Justificacion_Subsanacion_Java2.md', generateReport());
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Proyecto_Java2_Subsanado_Final.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      alert('Error al generar el ZIP.');
    } finally {
      setExportingZip(false);
    }
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReport());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <div className="flex items-center gap-3">
            <div className={styles.headerIcon}><Download className="w-5 h-5" /></div>
            <div>
              <h2 className={styles.headerTitle}>Exportar entrega final de Java II</h2>
              <p className={styles.headerSubtitle}>Descarga el proyecto en .zip y la memoria de justificación</p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X className="w-5 h-5" /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.infoBox}>
            <Sparkles className={styles.infoBoxIcon} />
            <div>
              <strong className="block font-bold mb-0.5">¡Tu paquete de subsanación está listo!</strong>
              El ZIP incluirá todos tus archivos Java corregidos y el informe en Markdown.
            </div>
          </div>

          <div className="space-y-3">
            <h3 className={styles.filesLabel}>Archivos incluidos:</h3>
            <div className={styles.filesList}>
              <div className={styles.filesListReport}>
                <FileText className="w-4 h-4" />
                Informe_Justificacion_Subsanacion_Java2.md
              </div>
              {proposedFiles.map((f, i) => (
                <div key={i} className={styles.filesListItem}>
                  <span>{f.path || f.name}</span>
                  <span className={styles.filesListBadge}>Corregido</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleCopyReport} className={styles.copyBtn}>
            {copiedReport
              ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" />¡Memoria copiada!</>
              : <><FileText className="w-4 h-4" />Copiar memoria de justificación</>
            }
          </button>
          <button onClick={handleDownloadZip} disabled={exportingZip} className={styles.downloadBtn}>
            {exportingZip
              ? <><Loader2 className="w-4 h-4 animate-spin" />Generando ZIP...</>
              : <><Download className="w-4 h-4" />Descargar todo el proyecto (.zip)</>
            }
          </button>
        </div>

      </div>
    </div>
  );
};
