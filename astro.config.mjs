// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Module id -> display name (Sylo's src/modules/registry.js), grouped and
// ordered like the dashboard's Overview page (src/web/lib/overviewSummary.js
// LAYOUT) so this sidebar doesn't drift from how the dashboard organises
// modules. All 35 registry modules except honeypot (see below). A third entry
// marks a module the registry flags `beta: true`.
const moduleGroups = [
  {
    label: 'Core',
    modules: [['moderation', 'Moderation']],
  },
  {
    label: 'Moderation & filtering',
    modules: [
      ['automod', 'Auto-moderation'],
      // 'honeypot' (beta) is missing here: docs/modules/honeypot.md doesn't
      // exist in the Sylo repo yet, so there's nothing to import. Add it once
      // the doc exists (scripts/import-modules.mjs picks it up by itself).
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
      // Owner-only: only the instance owner (OWNER_IDS / FLUXER_OWNER_IDS) can
      // see or enable it in the dashboard.
      ['apple-connect', 'App Store Connect (owner)', { beta: true }],
    ],
  },
];

const beta = { text: 'Beta', variant: 'caution' };

const modulesSidebar = [
  { label: 'Overview', slug: 'modules' },
  ...moduleGroups.map((g) => ({
    label: g.label,
    items: g.modules.map(([id, label, opts]) => ({
      label,
      slug: `modules/${id}`,
      ...(opts?.beta ? { badge: beta } : {}),
    })),
  })),
];

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
        // Fence languages the imported Sylo docs use that Shiki doesn't know:
        // there's no Caddyfile grammar, so ```caddy / ```caddyfile render as
        // plain text, and ```env is Shiki's "dotenv" — no warning per build.
        shiki: { langAlias: { caddy: 'txt', caddyfile: 'txt', env: 'dotenv' } },
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
            { label: 'Postgres', slug: 'self-hosting/postgres' },
          ],
        },
        {
          label: 'Apps & dashboard',
          items: [
            { label: 'Sylo app (iOS)', slug: 'app/ios', badge: beta },
            { label: 'Dashboard V2', slug: 'dashboard/v2', badge: beta },
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
              label: 'TestFlight beta',
              link: 'https://testflight.apple.com/join/6FXxPjxu',
              attrs: { target: '_blank' },
            },
            {
              // The roadmap is built into Sylo's own dashboard (the old Fider
              // board at roadmap.sylobot.com is retired).
              label: 'Roadmap',
              link: 'https://app.sylobot.com/roadmap',
              attrs: { target: '_blank' },
            },
          ],
        },
      ],
    }),
  ],
});
