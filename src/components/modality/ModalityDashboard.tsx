import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle2, Play, X } from 'lucide-react';
import { StudentPersonaMode, JavaFile } from '../../data/types';
import { MODALITY_CONFIGS } from './modalityConfig';
import styles from './ModalityDashboard.module.css';

interface ModalityDashboardProps {
  mode: StudentPersonaMode;
  onBack: () => void;
  onStartAnalysis: (files: Record<string, any>, refinementValues: Record<string, boolean | string>) => void;
  isAnalyzing?: boolean;
}

interface FileState {
  [fileId: string]: {
    name: string;
    content: string;
  };
}

export const ModalityDashboard: React.FC<ModalityDashboardProps> = ({
  mode,
  onBack,
  onStartAnalysis,
  isAnalyzing = false,
}) => {
  const config = MODALITY_CONFIGS[mode];
  const [files, setFiles] = useState<FileState>({});
  const [refinementValues, setRefinementValues] = useState<Record<string, boolean | string>>(
    Object.fromEntries(config.refinementOptions.map(opt => [opt.id, opt.defaultValue ?? false]))
  );

  const handleFileSelect = (fileId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReq = config.fileRequirements.find(f => f.id === fileId);
      
      if (fileReq?.type === 'text') {
        // Lee el contenido del archivo de texto
        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = evt.target?.result as string;
          setFiles(prev => ({
            ...prev,
            [fileId]: {
              name: file.name,
              content: content,
            },
          }));
        };
        reader.readAsText(file);
      } else {
        // Para archivos ZIP, solo guarda el nombre
        setFiles(prev => ({
          ...prev,
          [fileId]: {
            name: file.name,
            content: '',
          },
        }));
      }
    }
  };

  const triggerFileInput = (fileId: string) => {
    const input = document.getElementById(`file-input-${fileId}`) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });
    const input = document.getElementById(`file-input-${fileId}`) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handleRefinementChange = (optionId: string, value: boolean | string) => {
    setRefinementValues(prev => ({ ...prev, [optionId]: value }));
  };

  const allRequiredFilesFilled = config.fileRequirements
    .filter(req => req.required)
    .every(req => files[req.id] && files[req.id].content);

  const handleAnalyze = () => {
    if (!allRequiredFilesFilled) {
      alert('Por favor, carga todos los archivos requeridos.');
      return;
    }
    onStartAnalysis(files, refinementValues);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          <ArrowLeft className="w-4 h-4" />
          Volver al campus
        </button>
        <div>
          <h1 className={styles.title}>{config.title}</h1>
          <p className={styles.subtitle}>{config.subtitle}</p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Descripción */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Acerca de este modo</h2>
          <p className={styles.description}>{config.description}</p>
        </section>

        {/* Carga de archivos */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cargar archivos</h2>

          <div className={styles.fileGrid}>
            {config.fileRequirements.map(fileReq => (
              <div key={fileReq.id} className={styles.fileCard}>
                <div className={styles.fileCardHeader}>
                  <h3 className={styles.fileCardTitle}>{fileReq.label}</h3>
                  {fileReq.required && <span className={styles.requiredBadge}>Requerido</span>}
                </div>
                <p className={styles.fileCardHint}>{fileReq.hint}</p>

                {fileReq.type === 'zip' ? (
                  <>
                    <button
                      onClick={() => triggerFileInput(fileReq.id)}
                      className={styles.uploadBtn}
                      type="button"
                    >
                      <Upload className="w-5 h-5" />
                      Seleccionar ZIP
                    </button>
                    <input
                      id={`file-input-${fileReq.id}`}
                      type="file"
                      accept=".zip"
                      onChange={e => handleFileSelect(fileReq.id, e)}
                      className="hidden"
                      style={{ display: 'none' }}
                    />
                  </>
                ) : (
                  <>
                    <textarea
                      id={`text-input-${fileReq.id}`}
                      placeholder={`Pega aquí el ${fileReq.label.toLowerCase()}...`}
                      value={files[fileReq.id]?.content || ''}
                      onChange={e => {
                        const text = e.target.value;
                        setFiles(prev => ({
                          ...prev,
                          [fileReq.id]: {
                            name: `${fileReq.id}.txt`,
                            content: text,
                          },
                        }));
                      }}
                      className={styles.textarea}
                    />
                    <button
                      onClick={() => triggerFileInput(fileReq.id)}
                      className={styles.uploadBtnSecondary}
                      type="button"
                    >
                      <Upload className="w-4 h-4" />
                      O selecciona un archivo
                    </button>
                    <input
                      id={`file-input-${fileReq.id}`}
                      type="file"
                      accept=".pdf,.txt"
                      onChange={e => handleFileSelect(fileReq.id, e)}
                      className="hidden"
                      style={{ display: 'none' }}
                    />
                  </>
                )}

                {files[fileReq.id] && (
                  <div className={styles.fileLoaded}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className={styles.fileName}>{files[fileReq.id].name}</span>
                    <button
                      onClick={() => removeFile(fileReq.id)}
                      className={styles.removeBtn}
                      title="Eliminar"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Opciones de refinamiento */}
        {config.refinementOptions.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ajustar análisis</h2>
            <p className={styles.refinementHint}>
              Personaliza cómo se ejecutará el análisis
            </p>

            <div className={styles.optionsGrid}>
              {config.refinementOptions.map(option => (
                <div key={option.id} className={styles.optionItem}>
                  {option.type === 'checkbox' && (
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={refinementValues[option.id] as boolean}
                        onChange={e => handleRefinementChange(option.id, e.target.checked)}
                        className={styles.checkbox}
                      />
                      <span className={styles.optionLabelText}>
                        <span className={styles.optionTitle}>{option.label}</span>
                        {option.description && (
                          <span className={styles.optionDesc}>{option.description}</span>
                        )}
                      </span>
                    </label>
                  )}

                  {option.type === 'select' && (
                    <label className={styles.selectContainer}>
                      <span className={styles.optionTitle}>{option.label}</span>
                      <select
                        value={refinementValues[option.id] as string}
                        onChange={e => handleRefinementChange(option.id, e.target.value)}
                        className={styles.select}
                      >
                        {option.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action bar */}
        <div className={styles.actionBar}>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !allRequiredFilesFilled}
            className={styles.analyzeBtn}
            type="button"
          >
            <Play className="w-4 h-4" />
            {isAnalyzing ? 'Analizando...' : 'Iniciar análisis'}
          </button>
          <span className={styles.requiredText}>
            {config.fileRequirements.filter(r => r.required).length} archivo(s) requerido(s)
          </span>
        </div>
      </div>
    </div>
  );
};
