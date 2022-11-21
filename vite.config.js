import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	build:{
		lib:{
			entry: [
				path.resolve(__dirname, './src/conditional-logic-repeater/conditional-logic-repeater.js'),
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
