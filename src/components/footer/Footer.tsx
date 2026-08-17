import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { MegaMenu } from '../megaMenu/MegaMenu';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  return (
    <>
      <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} onNavigate={onNavigate} />
      <footer className="bg-slate-900 text-white border-t border-slate-700 py-8 px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-6 text-sm"><a href="/documentation">Documentación</a><a href="/privacy">Privacidad</a><a href="/terms">Términos</a><a href="/contact">Contacto</a></div>
            <button type="button" onClick={() => setMegaMenuOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded"><Menu className="w-4 h-4" /><span>Explorar</span></button>
          </div>
          <div className="text-xs text-slate-400">Entorno Academico Seguro para Revisar tu codigo Java con IA</div>
          <div className="text-xs text-slate-500 text-center">Fullstack Dev Lovers</div>
          <div className="text-xs text-slate-400 text-center">© 2026 Java Studio - Desarrollado por <a href="mailto:blancadum@gmail.com" className="text-slate-300">Blanca De Una</a> para <a href="https://fullstack-dev-lovers.vercel.app/" className="text-slate-300">FWDL</a></div>
        </div>
      </footer>
    </>
  );
};

export default Footer;