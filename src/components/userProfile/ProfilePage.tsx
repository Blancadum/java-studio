import React, { useState, useRef } from 'react';
import { UserProfile, SavedSession } from '../../data/types';
import {
  ArrowLeft, Camera, Save, ExternalLink,
  Github, Linkedin, Twitter, Globe,
  Mail, User, FileText, Key, LogOut,
  AlertCircle, CheckCircle
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onBack: () => void;
  onLogout: () => void;
  onLoadSavedSession: (session: SavedSession) => void;
  onOpenAIConfig: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  onBack,
  onLogout,
  onLoadSavedSession,
  onOpenAIConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState((user as any).bio || '');
  const [institution, setInstitution] = useState(user.institution || '');
  const [website, setWebsite] = useState((user as any).website || '');
  const [github, setGithub] = useState((user as any).github || '');
  const [linkedin, setLinkedin] = useState((user as any).linkedin || '');
  const [twitter, setTwitter] = useState((user as any).twitter || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null);

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const markDirty = () => { setIsDirty(true); setSaveStatus('idle'); };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setAvatarPreview(ev.target?.result as string); markDirty(); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const updatedUser = { ...user, name, institution, avatarUrl: avatarPreview || user.avatarUrl, bio, website, github, linkedin, twitter } as UserProfile;
      onUpdateUser(updatedUser);
      setIsDirty(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (isDirty && !window.confirm('Tienes cambios sin guardar. ¿Salir de todos modos?')) return;
    onBack();
  };

  const handleOpenAIConfig = () => {
    if (isDirty && !window.confirm('Tienes cambios sin guardar. ¿Ir a configuración de IAs de todos modos?')) return;
    onOpenAIConfig();
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header sticky */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al campus
          </button>
          <div className="flex items-center gap-3">
            {isDirty && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Cambios sin guardar
              </span>
            )}
            {saveStatus === 'success' && (
              <span className="text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Guardado
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
          <p className="text-slate-500 text-sm mt-1">Tu información personal y cómo te ven los demás</p>
        </div>

        {/* Foto y datos básicos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Foto y datos básicos</h2>

          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-md"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              <button onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-600 hover:underline mt-1">
                Cambiar foto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <User className="w-3.5 h-3.5 inline mr-1" /> Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); markDirty(); }}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <Mail className="w-3.5 h-3.5 inline mr-1" /> Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Universidad / Instituto</label>
            <input
              type="text"
              value={institution}
              onChange={e => { setInstitution(e.target.value); markDirty(); }}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ej: Universidad Politécnica de Madrid"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              <FileText className="w-3.5 h-3.5 inline mr-1" /> Sobre mí
            </label>
            <textarea
              value={bio}
              onChange={e => { setBio(e.target.value); markDirty(); }}
              rows={3}
              maxLength={300}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Cuéntanos algo sobre ti, tu especialidad, en qué estás trabajando..."
            />
            <p className="text-xs text-slate-400 text-right mt-1">{bio.length}/300</p>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Redes y presencia online</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <Globe className="w-3.5 h-3.5 inline mr-1" /> Sitio web
              </label>
              <input
                type="url"
                value={website}
                onChange={e => { setWebsite(e.target.value); markDirty(); }}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://tuweb.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <Github className="w-3.5 h-3.5 inline mr-1" /> GitHub
              </label>
              <div className="flex">
                <span className="px-3 py-2.5 text-xs text-slate-400 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg whitespace-nowrap">github.com/</span>
                <input
                  type="text"
                  value={github}
                  onChange={e => { setGithub(e.target.value); markDirty(); }}
                  className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-w-0"
                  placeholder="tu-usuario"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <Linkedin className="w-3.5 h-3.5 inline mr-1" /> LinkedIn
              </label>
              <div className="flex">
                <span className="px-3 py-2.5 text-xs text-slate-400 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg whitespace-nowrap">linkedin.com/in/</span>
                <input
                  type="text"
                  value={linkedin}
                  onChange={e => { setLinkedin(e.target.value); markDirty(); }}
                  className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-w-0"
                  placeholder="tu-perfil"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <Twitter className="w-3.5 h-3.5 inline mr-1" /> X / Twitter
              </label>
              <div className="flex">
                <span className="px-3 py-2.5 text-xs text-slate-400 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg">@</span>
                <input
                  type="text"
                  value={twitter}
                  onChange={e => { setTwitter(e.target.value); markDirty(); }}
                  className="flex-1 px-3 py-2.5 text-sm border border-slate-200 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-w-0"
                  placeholder="tu-usuario"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Tu actividad</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <p className="text-2xl font-bold text-slate-900">{user.sessions.length}</p>
              <p className="text-xs text-slate-500 mt-1">Análisis hechos</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <p className="text-2xl font-bold text-amber-600">{((user.totalTokensSaved || 0) / 1000).toFixed(1)}k</p>
              <p className="text-xs text-slate-500 mt-1">Tokens ahorrados</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <p className="text-2xl font-bold text-emerald-600">
                {user.sessions.length > 0
                  ? Math.round(user.sessions.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / user.sessions.length)
                  : '—'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Nota media</p>
            </div>
          </div>
        </div>

        {/* Enlace a config de IA */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Key className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Mis IAs</p>
              <p className="text-xs text-slate-500">Gestiona tus claves de Gemini, OpenAI, Claude y más</p>
            </div>
          </div>
          <button
            onClick={handleOpenAIConfig}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            Configurar
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cerrar sesión */}
        <div className="bg-white border border-red-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-4">Zona de peligro</h2>
          <button
            onClick={() => { if (window.confirm('¿Seguro que quieres cerrar sesión?')) onLogout(); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>

      </div>
    </div>
  );
};
