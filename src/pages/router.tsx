import { createBrowserRouter } from 'react-router-dom';

import { CanvasPage } from './CanvasPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <CanvasPage />,
    },
]);
