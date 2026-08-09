import React, { useState } from 'react';
import { JavaFile } from '../../data/types';
import styles from './CodeDiffViewer.module.css';

interface CodeDiffViewerProps {
  noFiles: JavaFile[];
  fixedFiles: JavaFile[];
  proposedFiles: JavaFile[];
}

type Tab = 'no' | 'fixed' | 'proposed';

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({
  noFiles, fixedFiles, proposedFiles,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('no');

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'no',       label: 'Borrador inicial',   count: noFiles.length },
    { id: 'fixed',    label: 'JAVAII-FIXED',        count: fixedFiles.length },
    { id: 'proposed', label: 'Con propuestas',      count: proposedFiles.length },
  ];

  const files = activeTab === 'no' ? noFiles : activeTab === 'fixed' ? fixedFiles : proposedFiles;

  const cardClass = (tab: Tab) =>
    `${styles.fileCard} ${tab === 'no' ? styles.fileCardNo : tab === 'fixed' ? styles.fileCardFixed : styles.fileCardProposed}`;

  const headerClass = (tab: Tab) =>
    `${styles.fileHeader} ${tab === 'no' ? styles.fileHeaderNo : tab === 'fixed' ? styles.fileHeaderFixed : styles.fileHeaderProposed}`;

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {files.length === 0 ? (
        <div className={styles.empty}>No hay archivos en esta vista.</div>
      ) : (
        <div className={styles.fileGrid}>
          {files.map(file => (
            <div key={file.id} className={cardClass(activeTab)}>
              <div className={headerClass(activeTab)}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileVersion}>{file.version}</span>
              </div>
              <pre className={styles.codeArea}>{file.content}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
