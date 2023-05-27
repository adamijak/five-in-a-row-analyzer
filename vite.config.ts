import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	base: "/five-in-a-row-analyzer/",
	plugins: [sveltekit()]
});
