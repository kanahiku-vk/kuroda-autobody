import { defineField, defineType } from 'sanity';
import { BellIcon } from '@sanity/icons';

/**
 * Site notice — the navy strip above the top utility bar (holiday hours, closures …).
 * One site-wide document. Field names match `SiteNotice` in `src/config/notice.ts` — keep them in sync.
 * Visible only when "Show notice" is on AND today (Hawaiʻi time) is inside the optional dates.
 */
export const siteNotice = defineType({
  name: 'siteNotice',
  title: 'Site notice (top banner)',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show notice',
      type: 'boolean',
      description: 'Master switch. Off hides the banner on every page, whatever the dates.',
      initialValue: false,
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Short bold lead-in, e.g. “Holiday hours”.',
      validation: (r) => r.max(30),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      description: 'One line, e.g. “We will be closed Thursday 11/26 and Friday 11/27.”',
      validation: (r) =>
        r.max(160).custom((value, ctx) => {
          const enabled = (ctx.document as { enabled?: boolean } | undefined)?.enabled;
          return enabled && !value?.trim() ? 'Add a message before turning the notice on.' : true;
        }),
    }),
    defineField({
      name: 'showFrom',
      title: 'Show from (optional)',
      type: 'date',
      description: 'First day it appears. Leave empty to show right away.',
    }),
    defineField({
      name: 'showUntil',
      title: 'Show until (optional)',
      type: 'date',
      description:
        'Last day it appears (inclusive); it hides itself the next day. Leave empty to keep it until switched off.',
      validation: (r) =>
        r.custom((value, ctx) => {
          const from = (ctx.document as { showFrom?: string } | undefined)?.showFrom;
          return value && from && value < from ? '“Show until” must be on or after “Show from”.' : true;
        }),
    }),
  ],
  preview: {
    select: { enabled: 'enabled', message: 'message', until: 'showUntil' },
    prepare: ({ enabled, message, until }) => ({
      title: enabled ? 'Notice is ON' : 'Notice is OFF',
      subtitle: [message, until && `until ${until}`].filter(Boolean).join(' · '),
    }),
  },
});
