import React, { useState, useEffect } from 'react';
import { HardDrive, Folder, FileCode, ArrowLeft, Check, Loader2, X, Search } from 'lucide-react';
import { DriveFileItem, JavaFile } from '../../data/types';
import styles from './DrivePickerModal.module.css';

interface DrivePickerModalProps {
  accessToken: string;
  isOpen: boolean;
  onClose: () => void;
  onImportFiles: (noFiles: JavaFile[], fixedFiles: JavaFile[], teacherDocContent: string) => void;
}

export const DrivePickerModal: React.FC<DrivePickerModalProps> = ({
  accessToken, isOpen, onClose, onImportFiles,
}) => {
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [folderHistory, setFolderHistory] = useState([{ id: 'root', name: 'Mi Unidad' }]);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForNo, setSelectedForNo] = useState<DriveFileItem | null>(null);
  const [selectedForFixed, setSelectedForFixed] = useState<DriveFileItem | null>(null);
  const [selectedTeacherDoc, setSelectedTeacherDoc] = useState<DriveFileItem | null>(null);
  const [importing, setImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen && accessToken) loadFolder(currentFolderId);
  }, [isOpen, accessToken, currentFolderId]);

  const isFolder = (item: DriveFileItem) => item.mimeType === 'application/vnd.google-apps.folder';

  const loadFolder = async (folderId: string, search = '') => {
    setLoading(true);
    try {
      const q = search ? `&search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/drive/files?folderId=${folderId}${q}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (res.ok) setFiles(data.files || []);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateFolder = (folder: DriveFileItem) => {
    setCurrentFolderId(folder.id);
    setFolderHistory(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumb = (index: number) => {
    const history = folderHistory.slice(0, index + 1);
    setFolderHistory(history);
    setCurrentFolderId(history.at(-1)?.id || 'root');
  };

  const downloadContent = async (fileId: string): Promise<string> => {
    const res = await fetch(`/api/drive/file/${fileId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    return data.content || '';
  };

  const fetchFolderJava = async (folderId: string, version: 'JAVAII_NO' | 'JAVAII-FIXED'): Promise<JavaFile[]> => {
    const res = await fetch(`/api/drive/files?folderId=${folderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    const items: DriveFileItem[] = data.files || [];
    const result: JavaFile[] = [];
    for (const item of items) {
      if (!isFolder(item) && (item.name.endsWith('.java') || item.name.endsWith('.txt'))) {
        setStatusMessage(`Descargando ${item.name}...`);
        const content = await downloadContent(item.id);
        result.push({ id: item.id, name: item.name, path: item.name, content, version });
      }
    }
    return result;
  };

  const handleImport = async () => {
    if (!selectedForNo && !selectedForFixed && !selectedTeacherDoc) return;
    setImporting(true);
    setStatusMessage('Iniciando importación...');
    try {
      let noFiles: JavaFile[] = [];
      let fixedFiles: JavaFile[] = [];
      let teacherDocContent = '';

      if (selectedForNo) {
        noFiles = isFolder(selectedForNo)
          ? await fetchFolderJava(selectedForNo.id, 'JAVAII_NO')
          : [{ id: selectedForNo.id, name: selectedForNo.name, path: selectedForNo.name, content: await downloadContent(selectedForNo.id), version: 'JAVAII_NO' }];
      }
      if (selectedForFixed) {
        fixedFiles = isFolder(selectedForFixed)
          ? await fetchFolderJava(selectedForFixed.id, 'JAVAII-FIXED')
          : [{ id: selectedForFixed.id, name: selectedForFixed.name, path: selectedForFixed.name, content: await downloadContent(selectedForFixed.id), version: 'JAVAII-FIXED' }];
      }
      if (selectedTeacherDoc) {
        setStatusMessage('Cargando archivo de la profesora...');
        teacherDocContent = await downloadContent(selectedTeacherDoc.id);
      }
      onImportFiles(noFiles, fixedFiles, teacherDocContent);
      onClose();
    } catch (err: any) {
      alert('Error al importar: ' + err.message);
    } finally {
      setImporting(false);
      setStatusMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <div className="flex items-center gap-3">
            <div className={styles.headerIcon}><HardDrive className="w-5 h-5" /></div>
            <div>
              <h2 className={styles.headerTitle}>Explorar Google Drive</h2>
              <p className={styles.headerSubtitle}>Selecciona carpetas o archivos de tu proyecto</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection bar */}
        <div className={styles.selectionBar}>
          {[
            { label: 'Borrador inicial:', cls: styles.selectionLabelNo, sel: selectedForNo, clear: () => setSelectedForNo(null) },
            { label: 'JAVAII-FIXED:',     cls: styles.selectionLabelFixed, sel: selectedForFixed, clear: () => setSelectedForFixed(null) },
            { label: 'Doc profesora:',    cls: styles.selectionLabelDoc, sel: selectedTeacherDoc, clear: () => setSelectedTeacherDoc(null) },
          ].map(({ label, cls, sel, clear }) => (
            <div key={label} className={styles.selectionSlot}>
              <span className={cls}>{label}</span>
              <span className={styles.selectionName}>{sel ? sel.name : 'Sin seleccionar'}</span>
              {sel && <button type="button" onClick={clear} className={styles.clearBtn}>×</button>}
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.breadcrumbs}>
            {folderHistory.map((f, idx) => (
              <React.Fragment key={f.id}>
                {idx > 0 && <span className={styles.breadcrumbSep}>/</span>}
                <button
                  type="button"
                  onClick={() => handleBreadcrumb(idx)}
                  className={`${styles.breadcrumbBtn} ${idx === folderHistory.length - 1 ? styles.breadcrumbActive : ''}`}
                >
                  {f.name}
                </button>
              </React.Fragment>
            ))}
          </div>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar en esta carpeta..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); loadFolder(currentFolderId, e.target.value); }}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Browser */}
        <div className={styles.browser}>
          {loading ? (
            <div className={styles.loadingState}>
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-xs">Cargando archivos...</span>
            </div>
          ) : files.length === 0 ? (
            <div className={styles.emptyState}>Esta carpeta está vacía.</div>
          ) : (
            <div className={styles.filesGrid}>
              {files.map(item => {
                const folder = isFolder(item);
                const isNo  = selectedForNo?.id === item.id;
                const isFix = selectedForFixed?.id === item.id;
                const isDoc = selectedTeacherDoc?.id === item.id;
                return (
                  <div key={item.id} className={`${styles.fileItem} ${(isNo || isFix || isDoc) ? styles.fileItemSelected : ''}`}>
                    <button
                      type="button"
                      className="flex items-center gap-3 min-w-0 flex-1 text-left bg-transparent border-0 p-0"
                      onClick={() => { if (folder) handleNavigateFolder(item); }}
                    >
                      <div className={folder ? styles.fileIconFolder : styles.fileIconFile}>
                        {folder ? <Folder className="w-5 h-5 fill-amber-400/20" /> : <FileCode className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={styles.fileName}>{item.name}</p>
                        <p className={styles.fileMeta}>{folder ? 'Carpeta' : item.mimeType}</p>
                      </div>
                    </button>
                    <div className={styles.tagBtns}>
                      <button type="button" onClick={() => setSelectedForNo(item)}    className={`${styles.tagNo}    ${isNo  ? styles.tagNoActive    : ''}`}>JAVAII_NO</button>
                      <button type="button" onClick={() => setSelectedForFixed(item)} className={`${styles.tagFixed} ${isFix ? styles.tagFixedActive : ''}`}>JAVAII-FIXED</button>
                      <button type="button" onClick={() => setSelectedTeacherDoc(item)} className={`${styles.tagDoc} ${isDoc ? styles.tagDocActive   : ''}`}>Doc profesora</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerHint}>{importing ? statusMessage : 'Selecciona las fuentes y haz clic en Importar'}</span>
          <div className={styles.footerActions}>
            <button type="button" onClick={onClose} disabled={importing} className={styles.cancelBtn}>Cancelar</button>
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || (!selectedForNo && !selectedForFixed && !selectedTeacherDoc)}
              className={styles.importBtn}
            >
              {importing
                ? <><Loader2 className="w-4 h-4 animate-spin" />Importando...</>
                : <><Check className="w-4 h-4" />Cargar selección</>
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
