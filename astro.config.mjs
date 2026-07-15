// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? 'https://example.com';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [sitemap()],
  image: {
    domains: ['images.unsplash.com'],
  },
  // https://docs.astro.build/en/guides/fonts/
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter'
    }
  ]
});
