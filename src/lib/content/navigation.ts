import { navigationData } from '../../data/navigation';
import { isSanityConfigured } from '../sanity/client';
import { applyTokens } from './merge';
import { fetchDocument } from './singleton';
import { resolveContentImage, type SanityImageFields } from '../sanity/image';
import { fromDoc, NAVIGATION_ID } from './navigationDoc';
import { siteTokens } from './tokens';
import type { NavigationContent } from './types';

/**
 * Header + footer content = Sanity `siteNavigation` document merged over the built-in navigation
 * (src/data/navigation.ts, derived from the sitemap). Empty or invalid pieces keep the built-in ones, so the
 * site chrome is always complete — even when Sanity is unconfigured or unreachable.
 */
export async function getNavigationContent(): Promise<NavigationContent> {
  const doc = isSanityConfigured ? await fetchDocument(NAVIGATION_ID) : null;
  const content = doc ? fromDoc(doc, navigationData) : navigationData;
  const family = (doc as { footer?: { family?: { logoImage?: SanityImageFields; logoAlt?: string } } } | null)?.footer
    ?.family;
  const logo = resolveContentImage(family?.logoImage);
  if (logo) content.footer.family.logo = { src: logo.src, alt: family?.logoAlt?.trim() || content.footer.family.name };
  return applyTokens(content, siteTokens());
}
