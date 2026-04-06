// import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeSlug from 'rehype-slug'
import { relative, sep } from 'node:path';
import { createHighlighter } from 'shiki';

const codeHighlighter = await createHighlighter({
	themes: ['github-dark'],
	langs: ['bash', 'glsl', 'cpp', 'c', 'rust', 'javascript', 'java', 'cmake', 'json']
})

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), 
		mdsvex({ 
			extensions: ['.md'], 
			rehypePlugins: [rehypeSlug],
			highlight: {
				highlighter: (code, lang) => {
					let html = codeHighlighter.codeToHtml(code, {
							lang: lang ?? 'text',
							theme: 'github-dark'
					})
					
					// Escape curly braces to prevent Svelte from trying to interpret them as template syntax
					html = html
						.replace(/{/g, '&#123;')
						.replace(/}/g, '&#125;');

					return html;
				}
			}
	})],
	
	compilerOptions: {
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		}
	},
	kit: {
		// static adapter
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true,
		})
	}
};

export default config;
