export interface Principle {
  id: string;
  letter: string;
  title: string;
  description: string;
  fullSpan?: boolean;
}

export const SOLID_PRINCIPLES: Principle[] = [
  { id: 's', letter: 'S', title: 'Single Responsibility', description: 'Cada clase tiene una única razón para cambiar.' },
  { id: 'o', letter: 'O', title: 'Open/Closed', description: 'Abierto para extensión, cerrado para modificación.' },
  { id: 'l', letter: 'L', title: 'Liskov Substitution', description: 'Las subclases deben sustituir a sus clases base.' },
  { id: 'i', letter: 'I', title: 'Interface Segregation', description: 'Muchas interfaces específicas en lugar de una general.' },
  { id: 'd', letter: 'D', title: 'Dependency Inversion', description: 'Depende de abstracciones, no de implementaciones concretas.', fullSpan: true },
];