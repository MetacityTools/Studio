import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ModelEditor } from './Editor';
import { ErrorPage } from './Utils/Error';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ModelEditor />,
        errorElement: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
