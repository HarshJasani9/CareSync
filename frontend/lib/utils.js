import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes safely — prevents conflicts between
 * utility classes (e.g., `p-2` vs `p-4`).
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
