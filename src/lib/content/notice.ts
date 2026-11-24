import { isNoticeVisible, noticeFallback, type SiteNotice } from '../../config/notice';
import { fetchDocument } from './singleton';

/**
 * The notice to show above the navbar, or null (switched off, outside its dates, no text, Sanity unreachable).
 * Read straight from the Sanity `siteNotice` document — not via getSingleton, whose merge ignores booleans.
 */
export async function getActiveNotice(): Promise<SiteNotice | null> {
  const doc = (await fetchDocument('siteNotice')) as Partial<SiteNotice> | null;
  if (!doc) return null;
  const notice: SiteNotice = {
    enabled: doc.enabled === true,
    label: doc.label?.trim() ?? noticeFallback.label,
    message: doc.message?.trim() ?? noticeFallback.message,
    showFrom: doc.showFrom || undefined,
    showUntil: doc.showUntil || undefined,
  };
  return isNoticeVisible(notice) ? notice : null;
}
