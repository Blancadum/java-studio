import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, X } from 'lucide-react';
import { ChatMessage, AnalysisResult } from '../../data/types';
import styles from './JavaTutorChat.module.css';
import { api } from '../../lib/api';


interface JavaTutorChatProps {
  analysis: AnalysisResult | null;
  teacherDoc: string;
  initialQuery?: string;
  onClose?: () => void;
}

const SUGGESTED = [
  '¿Cómo implemento las excepciones personalizadas?',
  '¿Qué diferencia hay entre JAVAII_NO y JAVAII-FIXED?',
  '¿Cómo hago pruebas con JUnit 5 para ReservaService?',
  'Escribe la justificación para la profesora.',
];

export const JavaTutorChat: React.FC<JavaTutorChatProps> = ({
  analysis, teacherDoc, initialQuery, onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome',
    sender: 'ai',
    text: '¡Hola! Soy tu Profe Virtual de Java. He revisado tu sesión. ¿En qué duda puedo ayudarte?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const processedRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialQuery?.trim() && processedRef.current !== initialQuery) {
      processedRef.current = initialQuery;
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (text?: string) => {
    const query = text || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    if (!text) setInput('');
    setLoading(true);

    try {
      const data = await api.chatWithTutor({
        message: query,
        context: { analysis, teacherDoc }
      });
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'Sin respuesta',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Ocurrió un error: ' + err.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div className="flex items-center gap-3">
          <div className={styles.headerIcon}><Sparkles className="w-5 h-5" /></div>
          <div>
            <h3 className={styles.headerTitle}>Tutor consultor Java II (IA)</h3>
            <p className={styles.headerSubtitle}>POO, excepciones, JUnit y justificaciones para la profesora</p>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className={styles.closeBtn}><X className="w-5 h-5" /></button>
        )}
      </div>

      <div className={styles.chips}>
        <span className={styles.chipsLabel}>Sugerencias:</span>
        {SUGGESTED.map((q, i) => (
          <button type="button" key={i} onClick={() => handleSend(q)} disabled={loading} className={styles.chip}>{q}</button>
        ))}
      </div>

      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={`${msg.id}-${idx}`} className={`${styles.msgRow} ${msg.sender === 'user' ? styles.msgRowUser : ''}`}>
            <div className={msg.sender === 'user' ? styles.avatarUser : styles.avatarAi}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAi}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className={`${styles.msgTime} ${msg.sender === 'user' ? styles.msgTimeUser : ''}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className={styles.loadingRow}>
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            <span>El tutor está escribiendo...</span>
          </div>
        )}
      </div>

      <div className={styles.inputBar}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu duda sobre Java II..."
          className={styles.input}
        />
        <button type="button" onClick={() => handleSend()} disabled={loading || !input.trim()} className={styles.sendBtn}>
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
