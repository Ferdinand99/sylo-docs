// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Module id -> docs/modules/<id>.md display name, and the Core / Moderation &
// filtering / Engagement / Utilities / Social alerts grouping — both taken
// from the dashboard's own module taxonomy (src/web/lib/overviewSummary.js's
// LAYOUT, and web-v2's docs.js MODULES_DOCS list) so this sidebar doesn't
// drift from how the dashboard itself organises modules.
const moduleGroups = [
  {
    label: 'Core',
    modules: [['moderation', 'Moderation']],
  },
  {
    label: 'Moderation & filtering',
    modules: [
      ['automod', 'Auto-moderation'],
      // 'honeypot' is missing here: docs/modules/honeypot.md doesn't exist in
      // the Sylo repo yet (site/docs.js references it too, so the live
      // docs.html page has had a silently-broken fetch for it already).
      ['verification', 'Verification'],
      ['appeals', 'Ban appeals'],
      ['logging', 'Server logging'],
    ],
  },
  {
    label: 'Engagement',
    modules: [
      ['welcome', 'Welcome & leave'],
      ['welcome-channel', 'Welcome channel'],
      ['roles', 'Reaction roles & autoroles'],
      ['counting', 'Counting'],
      ['leveling', 'Leveling'],
      ['starboard', 'Starboard'],
      ['sticky', 'Sticky messages'],
      ['birthdays', 'Birthdays'],
    ],
  },
  {
    label: 'Utilities',
    modules: [
      ['tickets', 'Tickets (modmail)'],
      ['reminders', 'Reminders'],
      ['custom-commands', 'Custom commands'],
      ['invite-tracker', 'Invite tracker'],
      ['polls', 'Polls'],
      ['giveaways', 'Giveaways'],
      ['autoresponder', 'Autoresponder'],
      ['auto-react', 'Auto-react'],
      ['afk', 'AFK'],
      ['server-stats', 'Server statistics'],
      ['insights', 'Server insights'],
      ['temp-voice', 'Temporary voice channels'],
      ['free-games', 'Free games'],
      ['game-stats', 'Game stats'],
      ['channel-cleanup', 'Channel cleanup'],
    ],
  },
  {
    label: 'Social alerts',
    modules: [
      ['twitch-alerts', 'Twitch alerts'],
      ['youtube-alerts', 'YouTube alerts'],
      ['kick-alerts', 'Kick alerts'],
      ['rss', 'RSS alerts'],
      ['github', 'GitHub alerts'],
    ],
  },
];

const modulesSidebar = moduleGroups.map((g) => ({
  label: g.label,
  items: g.modules.map(([id, label]) => ({ label, slug: `modules/${id}` })),
}));

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.sylobot.com',
  integrations: [
    starlight({
      title: 'Sylo docs',
      logo: { src: './src/assets/sylo-icon.webp', replacesTitle: false },
      // The look of sylobot.com: self-hosted Inter (variable, with optical
      // sizes) plus Sylo's palette mapped onto Starlight's --sl-* variables.
      customCss: ['@fontsource-variable/inter/opsz.css', './src/styles/sylo.css'],
      // Neutral GitHub syntax themes; the frame chrome uses the site's
      // surfaces — hairline border, 14px radius, no shadow, Inter for UI text.
      // Colours are literal per theme (not CSS vars) so Expressive Code can
      // still derive contrast-safe colours from them.
      expressiveCode: {
        themes: ['github-dark-default', 'github-light-default'],
        styleOverrides: {
          borderRadius: '14px',
          borderWidth: '1px',
          borderColor: ({ theme }) => (theme.type === 'dark' ? '#ffffff24' : '#00000024'),
          codeBackground: ({ theme }) => (theme.type === 'dark' ? '#111113' : '#ffffff'),
          uiFontFamily: 'var(--__sl-font)',
          frames: {
            terminalBackground: ({ theme }) => (theme.type === 'dark' ? '#111113' : '#ffffff'),
            editorTabBarBackground: ({ theme }) => (theme.type === 'dark' ? '#161618' : '#fbfbfd'),
            editorActiveTabBackground: ({ theme }) =>
              theme.type === 'dark' ? '#111113' : '#ffffff',
            editorActiveTabForeground: ({ theme }) =>
              theme.type === 'dark' ? '#f5f5f7' : '#1d1d1f',
            editorActiveTabIndicatorTopColor: 'transparent',
            editorActiveTabIndicatorBottomColor: 'transparent',
            editorTabBarBorderBottomColor: ({ theme }) =>
              theme.type === 'dark' ? '#ffffff14' : '#00000014',
            terminalTitlebarBackground: ({ theme }) =>
              theme.type === 'dark' ? '#161618' : '#fbfbfd',
            terminalTitlebarForeground: ({ theme }) =>
              theme.type === 'dark' ? '#a1a1a6' : '#6e6e73',
            terminalTitlebarBorderBottomColor: ({ theme }) =>
              theme.type === 'dark' ? '#ffffff14' : '#00000014',
            terminalTitlebarDotsForeground: ({ theme }) =>
              theme.type === 'dark' ? '#ffffff' : '#000000',
            terminalTitlebarDotsOpacity: '0.18',
            inlineButtonForeground: ({ theme }) => (theme.type === 'dark' ? '#f5f5f7' : '#1d1d1f'),
            shadowColor: 'transparent',
            frameBoxShadowCssValue: 'none',
          },
        },
      },
      social: [
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/GAzR9k5hhS' },
        { icon: 'github', label: 'Sylo on GitHub', href: 'https://github.com/Ferdinand99/Sylo' },
      ],
      editLink: {
        baseUrl: 'https://github.com/Ferdinand99/sylo-docs/edit/main/',
      },
      sidebar: [
        {
          label: 'Self-hosting',
          items: [
            { label: 'On Discord', slug: 'self-hosting/discord' },
            { label: 'On Fluxer', slug: 'self-hosting/fluxer' },
          ],
        },
        { label: 'Modules', items: modulesSidebar },
        {
          label: 'Legal',
          items: [
            {
              label: 'Privacy policy',
              link: 'https://github.com/Ferdinand99/Sylo/blob/main/docs/privacy-policy.md',
              attrs: { target: '_blank' },
            },
            {
              label: 'Terms of service',
              link: 'https://github.com/Ferdinand99/Sylo/blob/main/docs/terms-of-service.md',
              attrs: { target: '_blank' },
            },
          ],
        },
        {
          label: 'Elsewhere',
          items: [
            { label: 'sylobot.com', link: 'https://sylobot.com', attrs: { target: '_blank' } },
            {
              label: 'Sylo on GitHub',
              link: 'https://github.com/Ferdinand99/Sylo',
              attrs: { target: '_blank' },
            },
            {
              label: 'Sylo-Fluxer on GitHub',
              link: 'https://github.com/Ferdinand99/Sylo-Fluxer',
              attrs: { target: '_blank' },
            },
          ],
        },
      ],
    }),
  ],
});
