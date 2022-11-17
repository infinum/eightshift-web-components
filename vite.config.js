import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: [
				path.resolve(__dirname, './src/conditional-logic-repeater.svelte')
			],
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
