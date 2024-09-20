import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts'],
	splitting: false,
	format: ['esm', 'cjs'],
	dts: true,
	minify: true,
	bundle: true,
	clean: true,
	outDir: 'lib',
})
