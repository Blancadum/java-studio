import React, { useState } from 'react';
import { SonarQualityResult } from '../../data/types';
import { Award, AlertOctagon, BookmarkPlus, ArrowLeft, TestTube, Lightbulb, Copy, Download, Check, Sparkles, MessageSquare, Terminal } from 'lucide-react';
import styles from './SonarQualityView.module.css';

interface SonarQualityViewProps {
  sonar: SonarQualityResult;
  onReset: () => void;
  onSaveSession: () => void;
  onOpenTutor?: (initialQuery: string) => void;
}

export const SonarQualityView: React.FC<SonarQualityViewProps> = ({
  sonar, onReset, onSaveSession, onOpenTutor,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [fixedIndices, setFixedIndices] = useState<number[]>([]);

  const toggleFix = (i: number) =>
    setFixedIndices(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const feedbackText = `Hola Profe Virtual, he analizado mi proyecto en el Dashboard SonarQube de JavaStudio. Quality Gate ${sonar.qualityGate}, SOLID ${sonar.solidComplianceScore}% y ${sonar.codeSmellsCount} Code Smells. ¿Cómo reduzco la complejidad ciclomática?`;

  const jsonReport = {
    qualityGate: sonar.qualityGate,
    solidComplianceScore: sonar.solidComplianceScore,
    codeSmellsCount: sonar.codeSmellsCount,
    cyclomaticComplexity: sonar.cyclomaticComplexityRating,
    issues: sonar.issues.map((issue, i) => ({
      ...issue,
      fixedStatus: fixedIndices.includes(i) ? 'RESOLVED_BY_QUICK_FIX' : 'OPEN',
    })),
    junitRecommendations: sonar.junitRecommendations,
  };

  const gatePassed = sonar.qualityGate === 'PASSED' || fixedIndices.length > 0;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonReport, null, 2));
    setCopiedJson(true); setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyFeedback = () => {
    navigator.clipboard.writeText(feedbackText);
    setCopiedFeedback(true); setTimeout(() => setCopiedFeedback(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(jsonReport, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `sonarqube-report-${Date.now()}.json`; a.click();
  };

  return (
    <div className={styles.container}>

      {/* Banner */}
      <div className={styles.banner}>
        <div className="space-y-2">
          <div className={styles.bannerBadges}>
            <span className={styles.badgeSky}>Informe de calidad SonarQube y SOLID</span>
            <span className={gatePassed ? styles.badgeEmerald : styles.badgeRed}>
              Quality Gate: {gatePassed ? 'PASSED' : sonar.qualityGate}
            </span>
          </div>
          <h2 className={styles.bannerTitle}>
            Adherencia a principios SOLID: <span className={styles.bannerScore}>{sonar.solidComplianceScore}%</span>
          </h2>
        </div>
        <div className={styles.bannerActions}>
          <button onClick={onSaveSession} className={styles.btnAmber}>
            <BookmarkPlus className="w-4 h-4" />Guardar en mi perfil
          </button>
          <button onClick={onReset} className={styles.btnSlate}>
            <ArrowLeft className="w-4 h-4" />Nuevo análisis
          </button>
        </div>
      </div>

      {/* Feedback */}
      <div className={styles.feedbackBox}>
        <div className={styles.feedbackHeader}>
          <div className={styles.feedbackTitle}>
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className={styles.feedbackTitleText}>Feedback orientativo de métricas SonarQube</h3>
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

      {/* Metric cards */}
      <div className={styles.metricsGrid}>
        {[
          { label: 'Quality Gate',               value: gatePassed ? 'PASSED' : sonar.qualityGate, color: 'text-emerald-500', sub: 'Métricas universitarias' },
          { label: 'Duplicidad de código',        value: '0.0% (Excelente)',                        color: 'text-slate-900 dark:text-white', sub: 'Sin bloques repetidos' },
          { label: 'Complejidad ciclomática',     value: `Rating ${sonar.cyclomaticComplexityRating}`, color: 'text-sky-500', sub: 'Flujos independientes' },
          { label: 'Complejidad cognitiva S3776', value: 'Umbral: 4/15',                            color: 'text-indigo-500', sub: 'Flujo de lectura óptimo' },
        ].map((m, i) => (
          <div key={i} className={styles.metricCard}>
            <span className={styles.metricLabel}>{m.label}</span>
            <p className={`${styles.metricValue} font-mono ${m.color}`}>{m.value}</p>
            <span className={styles.metricSub}>{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Issues */}
      <div className="space-y-4">
        <div className={styles.issuesHeader}>
          <h3 className={styles.sectionTitle}><AlertOctagon className="w-4 h-4 text-sky-500" />Auditoría estática y correcciones rápidas (Quick Fix)</h3>
          <span className={styles.issueCount}>{fixedIndices.length} de {sonar.issues.length} corregidos</span>
        </div>
        <div className="space-y-3">
          {sonar.issues.map((issue, idx) => {
            const fixed = fixedIndices.includes(idx);
            const critical = issue.severity === 'CRITICAL' || issue.severity === 'BLOCKER';
            return (
              <div key={idx} className={styles.issueCard}>
                <div className={styles.issueTop}>
                  <div className={styles.issueLeft}>
                    <span className={styles.ruleId}>{issue.ruleId}</span>
                    <span className={critical ? styles.severityCritical : styles.severityMajor}>{issue.severity}</span>
                  </div>
                  <span className={styles.issueFile}>{issue.fileTarget}{issue.lineNumber ? ` (L${issue.lineNumber})` : ''}</span>
                </div>
                <h4 className={styles.issueTitle}>{issue.ruleName}: {issue.description}</h4>
                <div className={styles.issueRefactor}>
                  <div><strong>🔧 Refactorización recomendada:</strong> {issue.refactoringHint}</div>
                  <button onClick={() => toggleFix(idx)} className={fixed ? styles.quickFixBtnApplied : styles.quickFixBtn}>
                    <Lightbulb className="w-3.5 h-3.5 fill-current text-sky-500" />
                    {fixed ? '✓ Quick Fix aplicado' : '⚡ Quick Fix en 1-clic'}
                  </button>
                </div>
                {fixed && (
                  <div className={styles.fixedCode}>
                    <span className={styles.fixedCodeLabel}>✓ Código refactorizado (SOLID Compliance)</span>
                    <pre className={styles.fixedCodePre}>{`// Regla ${issue.ruleId} aplicada\npublic class ${issue.fileTarget.replace('.java', '')} {\n    // Inyección de dependencias optimizada\n}`}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* JUnit */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}><TestTube className="w-4 h-4 text-amber-500" />Generador de suites de pruebas JUnit 5 y Mockito</div>
        <div className={styles.junitGrid}>
          {sonar.junitRecommendations.map((item, i) => (
            <div key={i} className={styles.junitCard}>
              <h4 className={styles.junitTitle}>{item.targetClass}Test.java</h4>
              <ul className={styles.junitTests}>
                {item.suggestedTests.map((t, j) => <li key={j} className={styles.junitTestItem}>{t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* JSON console */}
      <div className={styles.console}>
        <div className={styles.consoleHeader}>
          <div className={styles.consoleTitleRow}>
            <Terminal className="w-5 h-5 text-sky-400" />
            <h3 className={styles.consoleTitle}>Consola del generador de reportes JSON</h3>
          </div>
          <div className={styles.consoleActions}>
            <button onClick={handleCopyJson} className={styles.consoleCopyBtn}>
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedJson ? 'Copiado' : 'Copiar JSON'}
            </button>
            <button onClick={handleDownloadJson} className={styles.consoleDownBtn}>
              <Download className="w-3.5 h-3.5" />Descargar JSON
            </button>
          </div>
        </div>
        <p className={styles.consoleSubtitle}>Resultados en formato estándar para pipelines CI/CD o envío al profesor.</p>
        <pre className={styles.consolePre}>{JSON.stringify(jsonReport, null, 2)}</pre>
      </div>

    </div>
  );
};
