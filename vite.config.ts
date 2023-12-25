import react from '@vitejs/plugin-react';
import { PluginOption, defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
    plugins: [
        react(),
        visualizer() as PluginOption,
    ],
    resolve: {
        alias: [{ find: "irdeck-proto", replacement: "/node_modules/irdeck-proto" }],
    },
    server: {
        host: true,
        hmr: {
            host: 'localhost'
        },
        watch: {
            usePolling: true
        }
    },
    build: {
        outDir: './build',
    },
})