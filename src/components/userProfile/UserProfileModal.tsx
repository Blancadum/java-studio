import React, { useState } from 'react';
import { UserProfile, SavedSession, AiProvider } from '../../data/types';
import { X, User, Key, Database, Shield, CheckCircle2, Lock, Sparkles, Zap, RotateCcw, QrCode, FileCode, SlidersHorizontal } from 'lucide-react';
import styles from './UserProfileModal.module.css';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLoadSavedSession: (session: SavedSession) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLoadSavedSession
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'ai_keys' | 'sessions' | 'security'>('ai_keys');
  
  // API Keys state
  const [provider, setProvider] = useState<AiProvider>(user.apiConfig.preferredProvider || 'app_default');
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [backupKeyInput, setBackupKeyInput] = useState('');
  const [fallbackEnabled, setFallbackEnabled] = useState(user.apiConfig.fallbackEnabled ?? true);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [keyStatusMessage, setKeyStatusMessage] = useState<string | null>(null);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(user.twoFactorAuth?.enabled || false);

  if (!isOpen) return null;

  const handleSaveApiKeys = async () => {
    setIsSavingKey(true);
    setKeyStatusMessage(null);

    try {
      const res = await fetch('/api/user/api-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          config: {
            preferredProvider: provider,
            geminiUserKey: geminiKeyInput || undefined,
            backupUserKey: backupKeyInput || undefined,
            fallbackEnabled
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        onUpdateUser(data.user);
        setKeyStatusMessage('✓ Configuración de IA y Claves encriptadas correctamente.');
        setGeminiKeyInput('');
        setBackupKeyInput('');
      } else {
        setKeyStatusMessage('Error: ' + (data.error || 'No se pudo guardar la configuración.'));
      }
    } catch (err: any) {
      setKeyStatusMessage('Error de conexión: ' + err.message);
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    try {
      const res = await fetch('/api/user/2fa/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, enabled })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setIs2FAEnabled(enabled);
        onUpdateUser(data.user);
      }
    } catch (err) {
      console.error('Error toggling 2FA:', err);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.userAvatar}>
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className={styles.headerTitle}>
                {user.name}
                <span className={styles.userBadge}>
                  Estudiante Verificado
                </span>
              </h2>
              <p className={styles.userInfo}>{user.email} • {user.institution || 'Universidad Java'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNav}>
          <button
            onClick={() => setActiveTab('ai_keys')}
            className={`${styles.tabButton} ${activeTab === 'ai_keys' ? styles.active : ''}`}
          >
            <Key className="w-4 h-4" />
            Configuración Multi-IA & Claves API
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`${styles.tabButton} ${activeTab === 'sessions' ? styles.active : ''}`}
          >
            <Database className="w-4 h-4" />
            Sesiones Guardadas ({user.sessions.length})
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`${styles.tabButton} ${activeTab === 'account' ? styles.active : ''}`}
          >
            <User className="w-4 h-4" />
            Perfil & Ahorro Tokens
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`${styles.tabButton} ${activeTab === 'security' ? styles.active : ''}`}
          >
            <Shield className="w-4 h-4" />
            Seguridad & 2FA
          </button>
        </div>

        {/* Tab Body */}
        <div className={styles.tabBody}>
          
          {/* TAB 1: MULTI-AI & KEYS */}
          {activeTab === 'ai_keys' && (
            <div className={styles.tabContent}>
              <div className={styles.infoBox}>
                <Sparkles className={styles.infoBoxIcon} />
                <div className={styles.infoBoxText}>
                  <p className={styles.infoBoxTitle}>
                    Gestión Personalizada de Modelos de Inteligencia Artificial
                  </p>
                  Si tienes una cuenta de Gemini Pro contratada o tu propia clave API de Google AI Studio, puedes integrarla directamente. Se guardará de forma <strong>encriptada en el servidor</strong> para que no sea visible en el navegador.
                </div>
              </div>

              {/* Provider Selection Dropdown */}
              <div className="space-y-2">
                <label className={styles.label}>
                  Proveedor de IA Preferido
                </label>
                <div className={styles.providerGrid}>
                  <button
                    type="button"
                    onClick={() => setProvider('app_default')}
                    className={`${styles.providerButton} ${provider === 'app_default' ? styles.active : ''}`}
                  >
                    <div className={styles.providerButtonHeader}>
                      <Zap className={styles.providerButtonIcon} />
                      {provider === 'app_default' && <CheckCircle2 className={styles.providerButtonCheck} />}
                    </div>
                    <span className={styles.providerButtonTitle}>Servicio Incluido</span>
                    <span className={styles.providerButtonSubtitle}>Motor IA por defecto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('user_gemini')}
                    className={`${styles.providerButton} ${provider === 'user_gemini' ? styles.active : ''}`}
                  >
                    <div className={styles.providerButtonHeader}>
                      <Key className={styles.providerButtonIcon} />
                      {provider === 'user_gemini' && <CheckCircle2 className={styles.providerButtonCheck} />}
                    </div>
                    <span className={styles.providerButtonTitle}>Mi API Key (Gemini)</span>
                    <span className={styles.providerButtonSubtitle}>Usa tu cuota personal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('backup_fallback')}
                    className={`${styles.providerButton} ${provider === 'backup_fallback' ? styles.active : ''}`}
                  >
                    <div className={styles.providerButtonHeader}>
                      <RotateCcw className={styles.providerButtonIcon} />
                      {provider === 'backup_fallback' && <CheckCircle2 className={styles.providerButtonCheck} />}
                    </div>
                    <span className={styles.providerButtonTitle}>Canal de Respaldo</span>
                    <span className={styles.providerButtonSubtitle}>Fallback por saturación</span>
                  </button>
                </div>
              </div>

              {/* Gemini Key Input */}
              <div className={styles.inputContainer}>
                <div className={styles.inputHeader}>
                  <label className={styles.inputLabel}>
                    <Key className="w-4 h-4 text-amber-500" />
                    Clave API de Gemini Personal
                  </label>
                  {user.apiConfig.maskedGeminiKey ? (
                    <span className={styles.maskedKey}>
                      <Lock className="w-3 h-3" /> Encriptada ({user.apiConfig.maskedGeminiKey})
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Sin clave personal asignada</span>
                  )}
                </div>

                <input
                  type="password"
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  placeholder="Pega aquí tu API Key de Gemini (ej: AIzaSy...)"
                  className={styles.input}
                />
              </div>

              {/* Backup Fallback Switch */}
              <div className={styles.switchContainer}>
                <div>
                  <span className={styles.switchTitle}>
                    Conmutación Automática (Fallback de Respaldo)
                  </span>
                  <p className={styles.switchDescription}>
                    Si tu API Key agota la cuota o falla por límite de peticiones, la app cambiará suavemente al canal de respaldo sin interrumpir tu trabajo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFallbackEnabled(!fallbackEnabled)}
                  className={`${styles.switchButton} ${fallbackEnabled ? styles.enabled : styles.disabled}`}
                >
                  <div
                    className={`${styles.switchToggle} ${fallbackEnabled ? styles.enabled : styles.disabled}`}
                  />
                </button>
              </div>

              {/* Action Button & Status Message */}
              <div>
                {keyStatusMessage && (
                  <div className={styles.statusMessage}>
                    {keyStatusMessage}
                  </div>
                )}
                <button
                  onClick={handleSaveApiKeys}
                  disabled={isSavingKey}
                  className={styles.saveButton}
                >
                  {isSavingKey ? 'Guardando...' : 'Guardar y Encriptar Configuración'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SAVED SESSIONS */}
          {activeTab === 'sessions' && (
            <div className={styles.sessionsContainer}>
              <div className={styles.sessionsHeader}>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Historial de Trabajos y Proyectos Guardados
                  </h3>
                  <p className="text-xs text-slate-500">
                    Accede a análisis previos sin consumir tokens ni realizar llamadas adicionales a la API.
                  </p>
                </div>
              </div>

              {user.sessions.length === 0 ? (
                <div className={styles.noSessions}>
                  Aún no tienes sesiones guardadas. Realiza una evaluación y haz clic en "Guardar en mi Perfil".
                </div>
              ) : (
                <div className={styles.sessionList}>
                  {user.sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={styles.sessionItem}
                    >
                      <div className={styles.sessionItemContent}>
                        <div className={styles.sessionItemHeader}>
                          <span className={styles.sessionBadge}>
                            {sess.personaMode}
                          </span>
                          <span className={styles.sessionDate}>
                            {new Date(sess.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <h4 className={styles.sessionTitle}>
                          {sess.title}
                        </h4>
                        <p className={styles.sessionSummary}>
                          {sess.summary}
                        </p>
                      </div>

                      <div className={styles.sessionActions}>
                        <div className="text-right">
                          <span className={styles.sessionScore}>
                            {sess.score}/100
                          </span>
                          <span className={styles.sessionTokens}>
                            +{sess.tokensSaved} tokens ahorrados
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            onLoadSavedSession(sess);
                            onClose();
                          }}
                          className={styles.loadSessionButton}
                        >
                          <FileCode className="w-4 h-4" />
                          Cargar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT & TOKENS */}
          {activeTab === 'account' && (
            <div className={styles.tabContent}>
              <div className={styles.accountGrid}>
                <div className={styles.tokenCard}>
                  <span className={styles.cardLabel}>
                    Economía de Tokens
                  </span>
                  <p className={styles.tokenValue}>
                    {user.totalTokensSaved.toLocaleString()} <span className="text-xs font-semibold text-slate-500">tokens</span>
                  </p>
                  <p className={styles.cardDescription}>
                    Ahorro acumulado al reutilizar sesiones guardadas e historial de feedback sin consultar de nuevo la IA.
                  </p>
                </div>

                <div className={styles.statusCard}>
                  <span className={styles.statusCardLabel}>
                    Estatus Académico
                  </span>
                  <p className={styles.statusValue}>
                    Estudiante Activo Java II
                  </p>
                  <p className={styles.cardDescription}>
                    {user.sessions.length} auditorías realizadas este curso.
                  </p>
                </div>
              </div>

              <div className={styles.inputContainer}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Datos Personales</h4>
                <div className={styles.personalDataGrid}>
                  <div>
                    <span className={styles.dataItemLabel}>Nombre</span>
                    <span className={styles.dataItemValue}>{user.name}</span>
                  </div>
                  <div>
                    <span className={styles.dataItemLabel}>Email</span>
                    <span className={styles.dataItemValue}>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & 2FA */}
          {activeTab === 'security' && (
            <div className={styles.tabContent}>
              <div className={styles.securityContainer}>
                <div className={styles.securityHeader}>
                  <div className={styles.securityInfo}>
                    <div className={styles.securityIconContainer}>
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={styles.securityTitle}>
                        Autenticación en Dos Pasos (2FA)
                      </h4>
                      <p className={styles.securityDescription}>
                        Protege tu cuenta y tus proyectos con Google Authenticator.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggle2FA(!is2FAEnabled)}
                    className={`${styles.toggle2FAButton} ${is2FAEnabled ? styles.enabled : styles.disabled}`}
                  >
                    {is2FAEnabled ? '✓ 2FA Activado' : 'Activar 2FA'}
                  </button>
                </div>

                {is2FAEnabled && (
                  <div className={styles.secretContainer}>
                    <span className={styles.label}>
                      Código Secreto de Google Authenticator
                    </span>
                    <div className={styles.secretCode}>
                      {user.twoFactorAuth.secret || 'J4V4-STUDI0-2FA-9876-AUTH'}
                    </div>
                    <p className={styles.switchDescription}>
                      Escanea o introduce esta clave en tu aplicación de verificación favorita para autenticar tus inicios de sesión futuros.
                    </p>
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
