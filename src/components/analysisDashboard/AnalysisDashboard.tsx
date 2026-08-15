import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, FileCode, MessageSquare, Download, BarChart3 } from 'lucide-react';
import JSZip from 'jszip';
import { AnalysisResult, JavaFile, ImprovementProposal } from '../../data/types';
import { TeacherChecklist } from '../teacher/TeacherChecklist';
import { ProposalList } from '../proposalList/ProposalList';
import { CodeDiffViewer } from '../codeDiff/CodeDiffViewer';
import { JavaTutorChat } from '../javaTutor/JavaTutorChat';
import styles from './AnalysisDashboard.module.css';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
  noFiles: JavaFile[];
  fixedFiles: JavaFile[];
  teacherDoc: string;
  onReset: () => void;
  onApplyProposal: (proposal: ImprovementProposal) => void;
  proposedFiles: JavaFile[];
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  noFiles,
  fixedFiles,
  teacherDoc,
  onReset,
  onApplyProposal,
  proposedFiles,
}) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'checklist' | 'diff' | 'chat'>('proposals');

  const getPassLikelihoodBadge = (likelihood: AnalysisResult['passLikelihood']) => {
    switch (likelihood) {
      case 'ALTA':
        return <span className={styles.badgeAlta}>Probabilidad alta de aprobar</span>;
      case 'MEDIA':
        return <span className={styles.badgeMedia}>Probabilidad media (aplica propuestas)</span>;
      default:
        return <span className={styles.badgeBaja}>Requiere revisión adicional</span>;
    }
  };

  const handleDownloadZip = async () => {
    if (proposedFiles.length === 0) {
      alert('No hay archivos propuestos para descargar.');
      return;
    }

    const zip = new JSZip();

    // Add a report file
    const reportMd = `# Informe de Subsanación - Java Studio\n\n## Resumen de la IA\n${analysis.summary}\n\n## Puntos Críticos Pendientes\n- ${analysis.criticalGaps.join('\n- ')}\n\n## Indicaciones de la Profesora\n${teacherDoc || 'No se proporcionaron.'}\n`;
    zip.file('INFORME_SUBSANACION.md', reportMd);

    // Add all proposed files
    proposedFiles.forEach(file => {
      const cleanedPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
      zip.file(cleanedPath, file.content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'java-studio-entrega-final.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>

      {/* Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerTop}>
          <div>
            <div className={styles.bannerBadges}>
              <span className={styles.bannerAuditBadge}>Informe de auditoría Java II</span>
              {getPassLikelihoodBadge(analysis.passLikelihood)}
            </div>
            <h2 className={styles.bannerTitle}>Diagnóstico y propuestas de subsanación</h2>
            <p className={styles.bannerSummary}>{analysis.summary}</p>
          </div>
          <button type="button"onClick={handleDownloadZip} className={styles.exportBtn}>
            <Download className="w-4 h-4" />
            Exportar entrega final (.zip)
          </button>
        </div>

        {/* Metric cards */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIconAmber}>{analysis.overallScore}</div>
            <div>
              <span className={styles.metricLabel}>Nota estimada Java II</span>
              <span className={styles.metricValue}>{analysis.overallScore} / 100</span>
            </div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIconEmerald}>{analysis.teacherComplianceScore}%</div>
            <div>
              <span className={styles.metricLabel}>Cumplimiento profesora</span>
              <span className={styles.metricValueEmerald}>
                {analysis.recommendations.filter(r => r.status === 'SATISFIED').length} de {analysis.recommendations.length} puntos
              </span>
            </div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIconBlue}>{analysis.proposals.length}</div>
            <div>
              <span className={styles.metricLabel}>Propuestas disponibles</span>
              <span className={styles.metricValue}>
                {analysis.proposals.filter(p => p.impact === 'HIGH').length} de impacto alto
              </span>
            </div>
          </div>
        </div>

        {/* Strengths / Gaps */}
        <div className={styles.strengthsGrid}>
          <div className={styles.strengthsBox}>
            <h4 className={styles.strengthsTitle}>
              <CheckCircle2 className="w-4 h-4" />
              Puntos fuertes en JAVAII-FIXED:
            </h4>
            <ul className={styles.list}>
              {analysis.keyStrengths.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </div>
          <div className={styles.gapsBox}>
            <h4 className={styles.gapsTitle}>
              <AlertTriangle className="w-4 h-4" />
              Puntos pendientes para aprobar:
            </h4>
            <ul className={styles.list}>
              {analysis.criticalGaps.map((g, idx) => <li key={idx}>{g}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar}>
        {([
          { id: 'checklist', label: `Requisitos profesora (${analysis.recommendations.length})`, icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'proposals', label: `Propuestas de código (${analysis.proposals.length})`, icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
          { id: 'diff',      label: 'Comparador diff Java',  icon: <FileCode className="w-4 h-4" /> },
          { id: 'chat',      label: 'Tutor IA Java II',      icon: <MessageSquare className="w-4 h-4 text-amber-500" /> },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'checklist' && (
        <TeacherChecklist
          recommendations={analysis.recommendations}
          onSelectProposalForTarget={() => setActiveTab('proposals')}
        />
      )}
      {activeTab === 'proposals' && (
        <ProposalList proposals={analysis.proposals} onApplyProposal={onApplyProposal} />
      )}
      {activeTab === 'diff' && (
        <CodeDiffViewer noFiles={noFiles} fixedFiles={fixedFiles} proposedFiles={proposedFiles} />
      )}
      {activeTab === 'chat' && (
        <JavaTutorChat analysis={analysis} teacherDoc={teacherDoc} />
      )}

    </div>
  );
};
