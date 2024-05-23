import { ViteDevServer } from 'vite';

export default (routes: string[]) => ({
    name: 'trailing',
    configureServer(server: ViteDevServer) {
        server.middlewares.use((req, res, next) => {
            const assets = ['ts', 'css', 'js'];

            const requestURLwithoutLeadingSlash = req?.url?.substring(1);
            const referrerWithoutTrailingSlash = req.headers.referer?.split('/').pop();
            const fileExtension = req.url?.split('.').pop();

            if (routes.includes(requestURLwithoutLeadingSlash || '')) {
                req.url = `${req.url}/`;
            }

            if (
                routes.includes(referrerWithoutTrailingSlash || '') &&
                assets.includes(fileExtension || '')
            ) {
                req.url = `/${referrerWithoutTrailingSlash}${req.url}`;
            }
            next();
        });
    },
});
