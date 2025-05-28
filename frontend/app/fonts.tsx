// src/fonts.ts or app/fonts.ts

import { Urbanist, Plus_Jakarta_Sans } from 'next/font/google';

/**
 * Font configuration for the application
 * - Urbanist: Used primarily for headings and titles
 * - Plus Jakarta Sans: Used for body text and descriptions
 * 
 * Both fonts include a range of weights to support various design needs.
 */
export const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap', // Ensures text remains visible during font loading
  variable: '--font-urbanist',
  fallback: ['system-ui', 'sans-serif'], // Fallback fonts
});

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plusjakarta',
  fallback: ['system-ui', 'sans-serif'],
});

// Export font class names for direct use in components
export const fontClasses = `${urbanist.variable} ${plusJakarta.variable}`;