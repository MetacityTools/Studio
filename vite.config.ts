import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, './src/Components'),
            '@utils': path.resolve(__dirname, './src/Utils'),
            '@elements': path.resolve(__dirname, './src/Elements'),
            '@bananagl': path.resolve(__dirname, './src/bananagl'),
            '@assets': path.resolve(__dirname, './src/assets'),
        },
    },
    plugins: [react()],
});
