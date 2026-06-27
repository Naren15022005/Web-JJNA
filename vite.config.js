import { defineConfig } from 'vite';

// Vanilla HTML/CSS/JS site — Vite is used purely as a dev server and bundler
// (no framework). `index.html` at the project root is the entry point.
export default defineConfig({
    // Relative base so the built assets work both on Vercel and from any subpath.
    base: './',
    server: {
        open: true
    },
    build: {
        outDir: 'dist',
        // Inline small assets, emit a clean, source-mapped production bundle.
        sourcemap: true,
        target: 'es2020'
    }
});
