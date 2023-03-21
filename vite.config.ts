import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@3D': path.resolve(__dirname, './src/3D'),
            '@app': path.resolve(__dirname, './src/App'),
            '@redux': path.resolve(__dirname, './src/Redux'),
        },
    },
    plugins: [react()],
});
