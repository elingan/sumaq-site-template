// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import devtoolsJson from 'vite-plugin-devtools-json';
import { qrcode } from 'vite-plugin-qrcode';

const site = process.env.SITE_URL ?? 'https://example.com';

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [
		sitemap(),
		mdx(),
		icon({
			iconDir: './src/assets/icons',
		}),
	],
	vite: {
		plugins: [
			qrcode(),
			devtoolsJson({ uuid: '6c4c6e45-e5fd-455e-b55f-935829f6593b' }),
		],
	},
	i18n: {
		defaultLocale: 'de',
		locales: ['de', 'en'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	image: {
		remotePatterns: [{ protocol: 'https' }],
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
