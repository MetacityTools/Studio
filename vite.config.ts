import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

import trailing from './plugins/trailing';

const build = {
    rollupOptions: {
        input: {
            main: path.resolve(__dirname, 'studio/index.html'),
            view: path.resolve(__dirname, 'studio/view/index.html'),
            privacy: path.resolve(__dirname, 'studio/privacy/index.html'),
        },
    },
    outDir: '../dist',
};

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@editor': path.resolve(__dirname, 'studio/src/components/Editor'),
            '@elements': path.resolve(__dirname, 'studio/src/components/Elements'),
            '@utils': path.resolve(__dirname, 'studio/src/utils'),
            '@bananagl': path.resolve(__dirname, 'studio/src/bananagl'),
            '@assets': path.resolve(__dirname, 'studio/src/assets'),
        },
    },
    //server: {
    //    https: true,
    //},
    root: 'studio',
    build,
    plugins: [react(), trailing(Object.keys(build.rollupOptions.input))], //, mkcert()],
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
});
