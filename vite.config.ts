import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@3D': path.resolve(__dirname, './src/3D'),
            '@components': path.resolve(__dirname, './src/Components'),
            '@redux': path.resolve(__dirname, './src/Redux'),
            '@workers': path.resolve(__dirname, './src/Workers'),
        },
    },
    plugins: [react()],
});
