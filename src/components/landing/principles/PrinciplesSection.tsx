import React from 'react';
import { SOLID_PRINCIPLES } from '../../../data/principles';

export const PrinciplesSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
            ▪ Arquitectura y Calidad
          </div>
          <h2 className="text-4xl font-bold text-black">
            Principios SOLID Aplicados
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Java Studio audita tu código según los principios SOLID de arquitectura orientada a objetos.
          </p>
        </div>

        {/* Grid de principios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
          {SOLID_PRINCIPLES.map((principle) => (
            <div
              key={principle.id}
              className={`group relative p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 transition-all ${
                principle.fullSpan ? 'md:col-span-2' : ''
              }`}
            >
              {/* Letter badge */}
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 mb-4">
                <span className="text-sm font-bold text-blue-700">
                  {principle.letter}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-black mb-2 group-hover:text-blue-700 transition-colors">
                {principle.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
