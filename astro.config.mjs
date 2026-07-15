// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? 'https://example.com';

// https://astro.build/config
export default defineConfig({
	site,
	adapter: cloudflare({
		// Sharp en build, Cloudflare Images en runtime (prerendered + on-demand).
		imageService: { build: 'compile', runtime: 'cloudflare-binding' },
	}),
	integrations: [sitemap()],
	image: {
		domains: ['images.unsplash.com'],
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-inter',
		},
	],
});
