import React, { useState } from 'react';
import { UserProfile, SavedSession } from '../../data/types';
import { X, User, Key, Database, Shield, Lock, Sparkles, QrCode, FileCode, ChevronDown, HardDrive } from 'lucide-react';
import { api } from '../../lib/api';
import styles from './UserProfileModal.module.css';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
  onLoadSavedSession: (session: SavedSession) => void;
  driveConnected?: boolean;
  onConnectDrive?: () => void;
  onOpenDriveModal?: () => void;
}

type AIProviderOption = 'gemini' | 'openai' | 'claude' | 'mistral' | 'deepseek' | 'groq' | 'cohere' | 'xai' | 'perplexity' | 'together' | 'azure' | 'ollama';

const AI_PROVIDERS: { id: AIProviderOption; label: string; placeholder: string; hint: string }[] = [
  { id: 'gemini', label: 'Google Gemini', placeholder: 'AIzaSy...', hint: 'Obtén tu clave en aistudio.google.com' },
  { id: 'openai', label: 'OpenAI (GPT-4o, GPT-4)', placeholder: 'sk-...', hint: 'Obtén tu clave en platform.openai.com' },
  { id: 'claude', label: 'Anthropic Claude', placeholder: 'sk-ant-...', hint: 'Obtén tu clave en console.anthropic.com' },
  { id: 'mistral', label: 'Mistral AI', placeholder: 'mist-...', hint: 'Obtén tu clave en console.mistral.ai' },
  { id: 'deepseek', label: 'DeepSeek (R1, V3)', placeholder: 'sk-...', hint: 'Obtén tu clave en platform.deepseek.com' },
  { id: 'groq', label: 'Groq (Llama 3, Mixtral ultrarrápido)', placeholder: 'gsk_...', hint: 'Obtén tu clave en console.groq.com' },
  { id: 'cohere', label: 'Cohere (Command R+)', placeholder: 'co-...', hint: 'Obtén tu clave en dashboard.cohere.com' },
  { id: 'xai', label: 'xAI Grok', placeholder: 'xai-...', hint: 'Obtén tu clave en console.x.ai' },
  { id: 'perplexity', label: 'Perplexity AI', placeholder: 'pplx-...', hint: 'Obtén tu clave en perplexity.ai/settings/api' },
  { id: 'together', label: 'Together AI', placeholder: 'tog-...', hint: 'Obtén tu clave en api.together.xyz' },
  { id: 'azure', label: 'Azure OpenAI', placeholder: 'Endpoint + clave de Azure...', hint: 'Configura tu recurso en portal.azure.com' },
  { id: 'ollama', label: 'Ollama (modelos locales)', placeholder: 'http://localhost:11434', hint: 'Instala Ollama en ollama.com y ponlo en marcha localmente' },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  onLoadSavedSession,
  driveConnected,
  onConnectDrive,
  onOpenDriveModal,
}) => {
  const [activeTab, setActiveTab] = useState<'ai_keys' | 'sessions' | 'account' | 'security' | 'drive'>('ai_keys');
  const [selectedProvider, setSelectedProvider] = useState<AIProviderOption>('gemini');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [fallbackEnabled, setFallbackEnabled] = useState(user.apiConfig?.fallbackEnabled ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(user.twoFactorAuth?.enabled || false);

  if (!isOpen) return null;

  const currentProvider = AI_PROVIDERS.find(p => p.id === selectedProvider)!;

  const handleSave = async () => {
    if (!apiKeyInput.trim()) { setStatusMessage('Por favor introduce una clave API.'); return; }
    setIsSaving(true); setStatusMessage(null);
    try {
      const configPayload: any = { preferredProvider: selectedProvider, fallbackEnabled, [`${selectedProvider}UserKey`]: apiKeyInput };
      const data = await api.updateUserApiConfig(configPayload);
      if (data.success && data.user) {
        onUpdateUser(data.user);
        setStatusMessage(`✓ Clave de ${AI_PROVIDERS.find(p => p.id === selectedProvider)?.label} guardada y encriptada.`);
        setApiKeyInput('');
      } else { setStatusMessage('Error: ' + (data.error || 'No se pudo guardar.')); }
    } catch (err: any) { setStatusMessage('Error de conexión: ' + err.message); }
    finally { setIsSaving(false); }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    try {
      const data = await api.toggleUser2FA(enabled);
      if (data.success && data.user) { setIs2FAEnabled(enabled); onUpdateUser(data.user); }
    } catch (err) { console.error('Error toggling 2FA:', err); }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.userAvatar}>{user.name.charAt(0)}</div>
            <div>
              <h2 className={styles.headerTitle}>
                {user.name}
                <span className={styles.userBadge}>Estudiante Verificado</span>
              </h2>
              <p className={styles.userInfo}>{user.email} • {user.institution || 'Universidad Java'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeButton}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabNav}>
          <button onClick={() => setActiveTab('ai_keys')} className={`${styles.tabButton} ${activeTab === 'ai_keys' ? styles.active : ''}`}>
            <Key className="w-4 h-4" /> Mis IAs
          </button>
          <button onClick={() => setActiveTab('drive')} className={`${styles.tabButton} ${activeTab === 'drive' ? styles.active : ''}`}>
            <HardDrive className="w-4 h-4" /> Drive
          </button>
          <button onClick={() => setActiveTab('sessions')} className={`${styles.tabButton} ${activeTab === 'sessions' ? styles.active : ''}`}>
            <Database className="w-4 h-4" /> Sesiones ({user.sessions.length})
          </button>
          <button onClick={() => setActiveTab('account')} className={`${styles.tabButton} ${activeTab === 'account' ? styles.active : ''}`}>
            <User className="w-4 h-4" /> Perfil
          </button>
          <button onClick={() => setActiveTab('security')} className={`${styles.tabButton} ${activeTab === 'security' ? styles.active : ''}`}>
            <Shield className="w-4 h-4" /> Seguridad
          </button>
        </div>

        <div className={styles.tabBody}>

          {/* TAB: IA */}
          {activeTab === 'ai_keys' && (
            <div className={styles.tabContent}>
              <div className={styles.infoBox}>
                <Sparkles className={styles.infoBoxIcon} />
                <div className={styles.infoBoxText}>
                  <p className={styles.infoBoxTitle}>Tu propia clave de IA</p>
                  Usa tu cuenta personal de cualquier proveedor. La clave se guarda <strong>encriptada en el servidor</strong> y nunca es visible en el navegador.
                </div>
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Proveedor de IA</label>
                <div className="relative">
                  <select
                    value={selectedProvider}
                    onChange={e => { setSelectedProvider(e.target.value as AIProviderOption); setApiKeyInput(''); setStatusMessage(null); }}
                    className={styles.input}
                    style={{ appearance: 'none', paddingRight: '2.5rem' }}
                  >
                    {AI_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-400 mt-1">{currentProvider.hint}</p>
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.inputHeader}>
                  <label className={styles.inputLabel}>
                    <Key className="w-4 h-4 text-amber-500" /> Clave API — {currentProvider.label}
                  </label>
                  {(() => {
                    const maskedKey = (user.apiConfig as any)?.[`masked${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}Key`];
                    return maskedKey ? <span className={styles.maskedKey}><Lock className="w-3 h-3" /> Guardada ({maskedKey})</span> : null;
                  })()}
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder={currentProvider.placeholder}
                    className={styles.input}
                    style={{ paddingRight: '5rem' }}
                  />
                  <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" title={showKey ? 'Ocultar' : 'Mostrar'}>
                    {showKey
                      ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {apiKeyInput.trim() && (
                  <button onClick={handleSave} disabled={isSaving} className={styles.saveButton} style={{ marginTop: '0.75rem' }}>
                    {isSaving ? 'Guardando...' : `Guardar clave de ${currentProvider.label}`}
                  </button>
                )}
              </div>

              <div className={styles.switchContainer}>
                <div>
                  <span className={styles.switchTitle}>Fallback automático</span>
                  <p className={styles.switchDescription}>Si tu clave agota la cuota, la app cambia al motor incluido sin interrumpir tu trabajo.</p>
                </div>
                <button type="button" onClick={() => setFallbackEnabled(!fallbackEnabled)} className={`${styles.switchButton} ${fallbackEnabled ? styles.enabled : styles.disabled}`}>
                  <div className={`${styles.switchToggle} ${fallbackEnabled ? styles.enabled : styles.disabled}`} />
                </button>
              </div>

              {statusMessage && <div className={styles.statusMessage}>{statusMessage}</div>}
            </div>
          )}

          {/* TAB: DRIVE */}
          {activeTab === 'drive' && (
            <div className={styles.tabContent}>
              <div className={styles.infoBox}>
                <HardDrive className={styles.infoBoxIcon} />
                <div className={styles.infoBoxText}>
                  <p className={styles.infoBoxTitle}>Sincronización con Google Drive</p>
                  Conecta tu Drive si quieres acceder rápidamente a tus ZIPs de prácticas sin tener que subirlos manualmente cada vez. Los resultados también se guardarán automáticamente en tu Drive.
                </div>
              </div>

              <div className={styles.switchContainer}>
                <div>
                  <span className={styles.switchTitle}>
                    {driveConnected ? '✅ Drive conectado' : 'Drive no conectado'}
                  </span>
                  <p className={styles.switchDescription}>
                    {driveConnected
                      ? 'Tu Google Drive está sincronizado. Puedes explorar tus carpetas y subir archivos directamente.'
                      : 'Aún no has conectado tu Google Drive. Hazlo para importar y exportar archivos fácilmente.'}
                  </p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${driveConnected ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>

              {driveConnected ? (
                <button onClick={() => { onOpenDriveModal?.(); onClose(); }} className={styles.saveButton}>
                  Explorar mis archivos en Drive
                </button>
              ) : (
                <button onClick={() => { onConnectDrive?.(); onClose(); }} className={styles.saveButton}>
                  Conectar Google Drive
                </button>
              )}

              <div className="space-y-2 pt-2">
                <p className="text-xs text-slate-400">🔒 Solo accedemos a los archivos que tú selecciones. Nunca a nada más.</p>
                <p className="text-xs text-slate-400">📂 Los resultados se guardarán en una carpeta <strong>Java Studio</strong> en la raíz de tu Drive.</p>
              </div>
            </div>
          )}

          {/* TAB: SESSIONS */}
          {activeTab === 'sessions' && (
            <div className={styles.sessionsContainer}>
              <div className={styles.sessionsHeader}>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Historial de Análisis</h3>
                  <p className="text-xs text-slate-500">Accede a análisis previos sin consumir tokens adicionales.</p>
                </div>
              </div>
              {user.sessions.length === 0 ? (
                <div className={styles.noSessions}>Aún no tienes sesiones guardadas. Realiza un análisis y guárdalo en tu perfil.</div>
              ) : (
                <div className={styles.sessionList}>
                  {user.sessions.map(sess => (
                    <div key={sess.id} className={styles.sessionItem}>
                      <div className={styles.sessionItemContent}>
                        <div className={styles.sessionItemHeader}>
                          <span className={styles.sessionBadge}>{sess.personaMode}</span>
                          <span className={styles.sessionDate}>{new Date(sess.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <h4 className={styles.sessionTitle}>{sess.title}</h4>
                        <p className={styles.sessionSummary}>{sess.summary}</p>
                      </div>
                      <div className={styles.sessionActions}>
                        <div className="text-right">
                          <span className={styles.sessionScore}>{sess.score}/100</span>
                          <span className={styles.sessionTokens}>+{sess.tokensSaved} tokens</span>
                        </div>
                        <button onClick={() => { onLoadSavedSession(sess); onClose(); }} className={styles.loadSessionButton}>
                          <FileCode className="w-4 h-4" /> Cargar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ACCOUNT */}
          {activeTab === 'account' && (
            <div className={styles.tabContent}>
              <div className={styles.accountGrid}>
                <div className={styles.tokenCard}>
                  <span className={styles.cardLabel}>Tokens ahorrados</span>
                  <p className={styles.tokenValue}>{user.totalTokensSaved.toLocaleString()} <span className="text-xs font-semibold text-slate-500">tokens</span></p>
                  <p className={styles.cardDescription}>Ahorro acumulado reutilizando sesiones guardadas.</p>
                </div>
                <div className={styles.statusCard}>
                  <span className={styles.statusCardLabel}>Estatus</span>
                  <p className={styles.statusValue}>Estudiante Activo Java II</p>
                  <p className={styles.cardDescription}>{user.sessions.length} análisis realizados.</p>
                </div>
              </div>
              <div className={styles.inputContainer}>
                <h4 className="text-xs font-bold text-slate-800 mb-3">Datos Personales</h4>
                <div className={styles.personalDataGrid}>
                  <div><span className={styles.dataItemLabel}>Nombre</span><span className={styles.dataItemValue}>{user.name}</span></div>
                  <div><span className={styles.dataItemLabel}>Email</span><span className={styles.dataItemValue}>{user.email}</span></div>
                </div>
              </div>
              <button onClick={onLogout} className="w-full mt-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                Cerrar sesión
              </button>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <div className={styles.tabContent}>
              <div className={styles.securityContainer}>
                <div className={styles.securityHeader}>
                  <div className={styles.securityInfo}>
                    <div className={styles.securityIconContainer}><QrCode className="w-5 h-5" /></div>
                    <div>
                      <h4 className={styles.securityTitle}>Autenticación en Dos Pasos (2FA)</h4>
                      <p className={styles.securityDescription}>Protege tu cuenta con Google Authenticator.</p>
                    </div>
                  </div>
                  <button onClick={() => handleToggle2FA(!is2FAEnabled)} className={`${styles.toggle2FAButton} ${is2FAEnabled ? styles.enabled : styles.disabled}`}>
                    {is2FAEnabled ? '✓ 2FA Activado' : 'Activar 2FA'}
                  </button>
                </div>
                {is2FAEnabled && (
                  <div className={styles.secretContainer}>
                    <span className={styles.label}>Código Secreto</span>
                    <div className={styles.secretCode}>{user.twoFactorAuth?.secret || 'J4V4-STUDI0-2FA-9876-AUTH'}</div>
                    <p className={styles.switchDescription}>Escanea o introduce esta clave en tu app de autenticación.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
