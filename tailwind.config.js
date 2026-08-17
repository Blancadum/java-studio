/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Clases dinámicas para ModesSection.tsx
    'from-amber-500',
    'to-amber-700',
    'bg-amber-50',
    'text-amber-800',
    'border-amber-200',

    'from-indigo-500',
    'to-indigo-700',
    'bg-indigo-50',
    'text-indigo-800',
    'border-indigo-200',

    'from-emerald-500',
    'to-emerald-700',
    'bg-emerald-50',
    'text-emerald-800',
    'border-emerald-200',

    'from-sky-500',
    'to-sky-700',
    'bg-sky-50',
    'text-sky-800',
    'border-sky-200',
    'from-blue-50',
    'to-blue-100',
    'from-green-50',
    'to-green-100',
    'from-yellow-50',
    'to-yellow-100',
    'from-purple-50', // Clases dinámicas para ExploreModesPage.tsx
    'to-purple-100',
  ],
}