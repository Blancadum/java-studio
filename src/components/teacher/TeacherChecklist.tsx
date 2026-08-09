import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { TeacherRecommendation } from '../../data/types';
import styles from './TeacherChecklist.module.css';

interface TeacherChecklistProps {
  recommendations: TeacherRecommendation[];
  onSelectProposalForTarget: () => void;
}

export const TeacherChecklist: React.FC<TeacherChecklistProps> = ({
  recommendations,
  onSelectProposalForTarget,
}) => {
  const statusIcon = (status: TeacherRecommendation['status']) => {
    if (status === 'SATISFIED') return <CheckCircle2 className="w-4 h-4" />;
    if (status === 'PARTIAL')   return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const itemClass = (status: TeacherRecommendation['status']) => {
    if (status === 'SATISFIED') return `${styles.item} ${styles.itemSatisfied}`;
    if (status === 'PARTIAL')   return `${styles.item} ${styles.itemPartial}`;
    return `${styles.item} ${styles.itemMissing}`;
  };

  const iconClass = (status: TeacherRecommendation['status']) => {
    if (status === 'SATISFIED') return styles.iconSatisfied;
    if (status === 'PARTIAL')   return styles.iconPartial;
    return styles.iconMissing;
  };

  return (
    <div className={styles.list}>
      {recommendations.map(rec => (
        <div key={rec.id} className={itemClass(rec.status)}>
          <div className={iconClass(rec.status)}>{statusIcon(rec.status)}</div>
          <div className={styles.itemBody}>
            <div className={styles.itemTop}>
              <span className={styles.itemTitle}>{rec.title}</span>
              <span className={styles.badgeCategory}>{rec.category}</span>
              {rec.priority === 'CRITICAL' && <span className={styles.badgeCritical}>Crítico</span>}
              {rec.priority === 'RECOMMENDED' && <span className={styles.badgeRecommend}>Recomendado</span>}
            </div>
            <p className={styles.itemDesc}>{rec.description}</p>
            {rec.teacherNote && (
              <p className={styles.teacherNote}>📝 Profesora: "{rec.teacherNote}"</p>
            )}
            {rec.status !== 'SATISFIED' && (
              <button onClick={onSelectProposalForTarget} className={styles.proposeBtn}>
                <ArrowRight className="w-3 h-3" />Ver propuestas de código
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
