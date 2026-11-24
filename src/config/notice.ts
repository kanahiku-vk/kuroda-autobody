/**
 * Site-wide notice strip above the top utility bar (holiday hours, closures …).
 * Content is edited in Sanity → "Site notice (top banner)": on/off switch, text, optional dates.
 * This file is only the shape + the built-in default (off) used when Sanity is unconfigured or unreachable.
 * Dates are Hawaiʻi calendar days (YYYY-MM-DD), inclusive.
 */
export interface SiteNotice {
  /** Master switch — off hides the strip regardless of dates. */
  enabled: boolean;
  /** Short bold label, e.g. "Holiday hours". */
  label: string;
  /** One-line message. */
  message: string;
  /** Optional first day to show. Empty = no start limit. */
  showFrom?: string;
  /** Optional last day to show (inclusive). Empty = stays until switched off. */
  showUntil?: string;
}

export const noticeFallback: SiteNotice = { enabled: false, label: '', message: '' };

const HAWAII_TZ = 'Pacific/Honolulu';

/** True when the notice is switched on, has text, and today (Hawaiʻi time) is inside its optional date window. */
export function isNoticeVisible(notice: SiteNotice, now: Date = new Date()): boolean {
  if (!notice.enabled || !notice.message?.trim()) return false;
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: HAWAII_TZ }).format(now); // YYYY-MM-DD
  if (notice.showFrom && today < notice.showFrom) return false;
  if (notice.showUntil && today > notice.showUntil) return false;
  return true;
}
