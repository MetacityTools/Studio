import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@atoms': path.resolve(__dirname, 'src/components/atoms'),
            '@molecules': path.resolve(__dirname, 'src/components/molecules'),
            '@organisms': path.resolve(__dirname, 'src/components/organisms'),
            '@templates': path.resolve(__dirname, 'src/components/templates'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@contexts': path.resolve(__dirname, 'src/contexts'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@gl': path.resolve(__dirname, 'src/features/webgl'),
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
        },
    },
    plugins: [react()],
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
});
