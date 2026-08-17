import React, { useState } from 'react';
import { StudentPersonaMode, JavaFile } from '../../data/types';
import { 
  FileText, Compass, ShieldCheck, Award,
  HardDrive, ChevronRight, Upload, BookOpen,
  Zap, Clock, CheckCircle, ArrowRight, Bot
} from 'lucide-react';

interface CampusProps {
  user: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    sessions?: any[];
    totalTokensSaved?: number;
  };
  activeMode: StudentPersonaMode;
  onSelectMode: (mode: StudentPersonaMode) => void;
  onOpenDriveModal: () => void;
  onLoadSample: () => void;
  onOpenProfile?: () => void;
  driveConnected?: boolean;
  onConnectDrive?: () => void;
  onOpenTutorWithQuery?: (query: string) => void;
  onLoadSession?: (session: any) => void;
  onStartAnalysis: (
    noFiles: JavaFile[],
    fixedFiles: JavaFile[],
    teacherDocContent: string,
    modeSpecificOptions: any
  ) => void;
  navigateToApp: (mode: StudentPersonaMode) => void;
}

const MODES = [
  {
    id: 'FEEDBACK_REVISION' as StudentPersonaMode,
    num: '01',
    title: 'Corregir con el feedback del profe',
    desc: 'Te han devuelto la práctica con comentarios. Sube el código y las notas de tu profe y te decimos exactamente qué cambiar.',
    icon: <FileText className="w-5 h-5" />,
    color: 'amber',
    steps: ['Sube tu código original', 'Añade los comentarios del profe', 'Obtén las correcciones'],
  },
  {
    id: 'ARCHITECTURE_NOOB' as StudentPersonaMode,
    num: '02',
    title: 'Empezar desde el enunciado',
    desc: 'Tienes el enunciado pero no sabes por dónde empezar. Te generamos un esqueleto de clases Java listo para rellenar.',
    icon: <Compass className="w-5 h-5" />,
    color: 'indigo',
    steps: ['Pega el enunciado', 'Elige cómo quieres el código', 'Consigue el esqueleto'],
  },
  {
    id: 'PRE_SUBMISSION_AUDIT' as StudentPersonaMode,
    num: '03',
    title: 'Revisar antes de entregar',
    desc: 'Ya tienes el código listo pero quieres asegurarte. Limpiamos rastros de IA, archivos innecesarios y comprobamos la rúbrica.',
    icon: <ShieldCheck className="w-5 h-5" />,
    color: 'emerald',
    steps: ['Sube tu proyecto final', 'Activamos los filtros', 'Te lo devolvemos limpio'],
  },
  {
    id: 'SONAR_QUALITY' as StudentPersonaMode,
    num: '04',
    title: 'Mejorar la calidad del código',
    desc: 'Quieres ir más allá. Analizamos tu código con criterios profesionales y te sugerimos cómo mejorar estructura y tests.',
    icon: <Award className="w-5 h-5" />,
    color: 'sky',
    steps: ['Sube tus clases Java', 'Elige qué reglas aplicar', 'Revisa los resultados'],
  },
];

const BADGE_COLOR: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  sky: 'bg-sky-100 text-sky-700 border-sky-200',
};

const RING_COLOR: Record<string, string> = {
  amber: 'ring-amber-400 bg-amber-50 border-amber-200',
  indigo: 'ring-indigo-400 bg-indigo-50 border-indigo-200',
  emerald: 'ring-emerald-400 bg-emerald-50 border-emerald-200',
  sky: 'ring-sky-400 bg-sky-50 border-sky-200',
};

export const Campus: React.FC<CampusProps> = ({
  user,
  activeMode,
  onSelectMode,
  onOpenDriveModal,
  onLoadSample,
  onOpenProfile,
  driveConnected,
  onConnectDrive,
  onOpenTutorWithQuery,
  onLoadSession,
  navigateToApp,
}) => {
  const [selectedMode, setSelectedMode] = useState<StudentPersonaMode | null>(null);

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() || '?';

  const handleSelectMode = (mode: StudentPersonaMode) => {
    setSelectedMode(mode);
    onSelectMode(mode);
    navigateToApp(mode);
  };

  const activeModeData = MODES.find(m => m.id === selectedMode);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              JS
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-900">Java Studio</h1>
              <p className="text-xs text-slate-500">Campus del estudiante</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!driveConnected ? (
              <button
                type="button"
                onClick={onConnectDrive}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <HardDrive className="w-3.5 h-3.5" />
                Conectar Drive
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenDriveModal}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <HardDrive className="w-3.5 h-3.5" />
                Drive conectado
              </button>
            )}

            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="hidden sm:inline">{user.name?.split(' ')[0] || 'Mi perfil'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Bienvenida */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Hola, {user.name?.split(' ')[0] || 'estudiante'} 👋
          </h2>
          <p className="text-slate-500 mt-1">¿En qué punto estás con tu práctica de Java?</p>
        </div>

        {/* Paso 1: Elige un modo */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">1</div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Elige por dónde empezar</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODES.map(mode => {
              const isActive = selectedMode === mode.id;
              return (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => handleSelectMode(mode.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isActive
                      ? `ring-2 ${RING_COLOR[mode.color]}`
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${BADGE_COLOR[mode.color]}`}>
                      {mode.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">{mode.num}</span>
                        {isActive && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 mt-0.5">{mode.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{mode.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paso 2: Cómo subir archivos */}
        {activeModeData && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">2</div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Pasos — {activeModeData.title}
              </h3>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {activeModeData.steps.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="text-sm text-slate-600">{step}</span>
                    </div>
                    {i < activeModeData.steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {driveConnected ? (
                  <button
                    type="button"
                    onClick={onOpenDriveModal}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <HardDrive className="w-4 h-4" />
                    Importar desde Google Drive
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onConnectDrive}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <HardDrive className="w-4 h-4" />
                    Conectar Google Drive
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onSelectMode(activeModeData.id);
                    document.getElementById('workspace-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Subir archivos desde mi ordenador
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onLoadSample}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Probar con ejemplo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Historial */}
        {user.sessions && user.sessions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Lo que ya has hecho</h3>
            </div>
            <div className="space-y-2">
              {user.sessions.slice(0, 5).map((session: any, i: number) => (
                <div key={i} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{session.title}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(session.createdAt).toLocaleDateString('es-ES')} · Puntuación: {session.score}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {((session.tokensSaved || 0) / 1000).toFixed(1)}k
                    </span>
                    {onLoadSession && (
                      <button
                        type="button"
                        onClick={() => onLoadSession(session)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Cargar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tutor rápido */}
        {onOpenTutorWithQuery && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">¿Atascado con algo?</p>
                <p className="text-xs text-slate-500">El tutor IA puede echarte una mano ahora mismo</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenTutorWithQuery('¿Cómo empiezo a usar Java Studio para mi práctica de Java II?')}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
            >
              Hablar con el tutor
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};