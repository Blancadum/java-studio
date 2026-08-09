import React, { useState } from 'react';
import { Copy, Check, Zap, CheckCircle } from 'lucide-react';
import { ImprovementProposal } from '../../data/types';
import styles from './ProposalList.module.css';

interface ProposalListProps {
  proposals: ImprovementProposal[];
  onApplyProposal: (proposal: ImprovementProposal) => void;
}

export const ProposalList: React.FC<ProposalListProps> = ({ proposals, onApplyProposal }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApply = (proposal: ImprovementProposal) => {
    onApplyProposal(proposal);
    setAppliedIds(prev => new Set(prev).add(proposal.id));
  };

  const impactBadge = (impact: ImprovementProposal['impact']) => {
    if (impact === 'HIGH')   return <span className={styles.impactHigh}>Impacto alto (aprobado)</span>;
    if (impact === 'MEDIUM') return <span className={styles.impactMedium}>Impacto medio</span>;
    return <span className={styles.impactLow}>Optimización</span>;
  };

  return (
    <div className={styles.list}>
      {proposals.map(prop => {
        const applied = appliedIds.has(prop.id) || prop.applied;
        return (
          <div key={prop.id} className={`${styles.card} ${applied ? styles.cardApplied : ''}`}>

            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.cardBadges}>
                  <span className={styles.fileTag}>{prop.fileTarget}</span>
                  {impactBadge(prop.impact)}
                  {prop.fulfillsTeacherPoint && (
                    <span className={styles.teacherBadge}>🎯 {prop.fulfillsTeacherPoint}</span>
                  )}
                </div>
                <h3 className={styles.cardTitle}>{prop.issueTitle}</h3>
              </div>
              <div className={styles.cardActions}>
                <button onClick={() => handleCopy(prop.proposedCode, prop.id)} className={styles.copyBtn}>
                  {copiedId === prop.id
                    ? <><Check className="w-3.5 h-3.5 text-emerald-500" />Copiado</>
                    : <><Copy className="w-3.5 h-3.5" />Copiar código</>
                  }
                </button>
                <button
                  onClick={() => handleApply(prop)}
                  disabled={applied}
                  className={applied ? styles.applyBtnApplied : styles.applyBtn}
                >
                  {applied
                    ? <><CheckCircle className="w-4 h-4" />Cambio aplicado</>
                    : <><Zap className="w-4 h-4" />Aplicar cambio</>
                  }
                </button>
              </div>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.description}>{prop.description}</p>

              <div className={styles.diffGrid}>
                <div className={styles.codeBlockOriginal}>
                  <div className={styles.codeHeaderOriginal}>
                    <span>Código original / incompleto</span>
                    <span className={styles.codeHeaderMeta}>JAVAII_NO / FIXED</span>
                  </div>
                  <pre className={`${styles.codeContent} ${styles.codeOriginal}`}>
                    {prop.originalCode || '// Sin implementación previa'}
                  </pre>
                </div>
                <div className={styles.codeBlockProposed}>
                  <div className={styles.codeHeaderProposed}>
                    <span>Propuesta de código corregida</span>
                    <span className={styles.codeHeaderMeta}>Recomendación IA</span>
                  </div>
                  <pre className={`${styles.codeContent} ${styles.codeProposed}`}>
                    {prop.proposedCode}
                  </pre>
                </div>
              </div>

              <div className={styles.explanation}>
                <strong className={styles.explanationTitle}>💡 Justificación técnica Java:</strong>
                {prop.explanation}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
