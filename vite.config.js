import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	build:{
		lib:{
			entry: [
				path.resolve(__dirname, './src/conditionalLogicRepeater/index.js'),
			],
			name: 'MyLibrary',
			formats: ['es'],
		},
		rollupOptions: {
			output: {
				entryFileNames: '[name].js',
			},
		},
	},
	plugins: [
		svelte({
			compilerOptions: {
				customElement: true,
			},
		}),
	],
})
