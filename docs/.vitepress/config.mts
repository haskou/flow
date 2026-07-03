import { defineConfig } from 'vitepress';

const gettingStartedSidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Introduction', link: '/getting-started/introduction' },
      { text: 'Installation', link: '/getting-started/installation' },
      { text: 'Basic usage', link: '/getting-started/basic-usage' },
    ],
  },
];

const guideSidebar = [
  {
    text: 'Guide',
    items: [
      { text: 'Overview', link: '/guides/' },
      { text: 'Examples', link: '/guides/examples' },
      { text: 'Composition', link: '/guides/composition' },
      { text: 'Error handling', link: '/guides/error-handling' },
      { text: 'Release flow', link: '/guides/release-flow' },
    ],
  },
];

const referenceSidebar = [
  {
    text: 'Overview',
    items: [{ text: 'Reference overview', link: '/reference/' }],
  },
  {
    text: 'Concurrency',
    collapsed: false,
    items: [
      { text: 'Semaphore', link: '/reference/semaphore' },
      { text: 'Queue', link: '/reference/queue' },
    ],
  },
  {
    text: 'Timing',
    collapsed: false,
    items: [
      { text: 'RateLimiter', link: '/reference/rate-limiter' },
      { text: 'Timeout', link: '/reference/timeout' },
      { text: 'Scheduler', link: '/reference/scheduler' },
      { text: 'Debouncer', link: '/reference/debouncer' },
      { text: 'Throttler', link: '/reference/throttler' },
    ],
  },
  {
    text: 'Resilience',
    collapsed: false,
    items: [
      { text: 'CircuitBreaker', link: '/reference/circuit-breaker' },
      { text: 'CircuitBreakerState', link: '/reference/circuit-breaker-state' },
      { text: 'Retrier', link: '/reference/retrier' },
    ],
  },
  {
    text: 'Configuration',
    collapsed: true,
    items: [{ text: 'Configuration values', link: '/reference/value-objects' }],
  },
  {
    text: 'Fallbacks and composition',
    collapsed: false,
    items: [
      { text: 'Flow', link: '/reference/flow' },
      { text: 'Racer', link: '/reference/racer' },
      { text: 'Abortable', link: '/reference/abortable' },
      { text: 'FallbackChain', link: '/reference/fallback-chain' },
      { text: 'FlowPipeline', link: '/reference/flow-pipeline' },
    ],
  },
  {
    text: 'Errors',
    collapsed: true,
    items: [{ text: 'Errors', link: '/reference/errors' }],
  },
];

export default defineConfig({
  lang: 'en-US',
  title: 'Flow',
  description: 'Documentation for @haskou/flow.',
  base: '/flow/',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#256f5c' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Flow' }],
    ['meta', { property: 'og:description', content: 'Documentation for @haskou/flow.' }],
  ],

  themeConfig: {
    siteTitle: 'Flow',

    nav: [
      { text: 'Getting Started', link: '/getting-started/introduction' },
      { text: 'Guide', link: '/guides/' },
      { text: 'Reference', link: '/reference/' },
      { text: 'npm', link: 'https://www.npmjs.com/package/@haskou/flow' },
    ],

    sidebar: {
      '/getting-started/': gettingStartedSidebar,
      '/guides/': guideSidebar,
      '/reference/': referenceSidebar,
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    search: {
      provider: 'local',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/haskou/flow' }],

    editLink: {
      pattern: 'https://github.com/haskou/flow/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Haskou',
    },
  },
});
