import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina condicionalmente clases de Tailwind CSS y las fusiona para resolver conflictos.
 * Requiere las librerías `clsx` y `tailwind-merge`.
 *
 * @param inputs Un array de valores de clase que pueden ser strings, objetos o arrays.
 * @returns Una cadena de texto con las clases CSS combinadas y resueltas.
 */
export function cn(...inputs: ClassValue[]) {
  // `clsx` combina las clases condicionalmente.
  // `twMerge` resuelve cualquier conflicto de clases de Tailwind (ej. "p-4" y "p-6" se convierte en "p-6").
  return twMerge(clsx(inputs))
}