import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	splitting: false,
	format: ['esm'],
	dts: true,
	minify: true,
	bundle: true,
	clean: true,
	outDir: 'lib',
	outExtension(ctx) {
		return { js: '.js', dts: 'd.ts' }
	},
})
