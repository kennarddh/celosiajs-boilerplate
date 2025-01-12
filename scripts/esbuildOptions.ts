import { BuildOptions } from 'esbuild'

const esbuildOptions = {
	entryPoints: ['./src/index.ts'],
	outdir: './build/',
	bundle: true,
	sourcemap: true,
	format: 'esm',
	platform: 'node',
	packages: 'external',
	minify: true,
	target: 'esnext',
	define: {
		'process.env.NODE_ENV': "'production'",
	},
} satisfies BuildOptions as BuildOptions

export default esbuildOptions
