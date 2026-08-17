import React from 'react';

export const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Email</h3>
        <p className="text-gray-600">blancadum@gmail.com</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Ubicación</h3>
        <p className="text-gray-600">Málaga, España</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Horario</h3>
        <p className="text-gray-600">Respuestas en 24-48 horas</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Reportar un Error</h3>
        <p className="text-gray-600">Si encuentras un bug, repórtalo en nuestro GitHub</p>
      </div>
    </div>
  );
};
