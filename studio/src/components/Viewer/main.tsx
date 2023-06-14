import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ViewContext } from '@utils/utils';

import { GeneralContext } from '@elements/Context';
import { ErrorPage } from '@elements/Error';

import '@assets/index.css';

import { ModelViewer } from './Viewer';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ModelViewer />,
        errorElement: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ViewContext>
            <GeneralContext>
                <RouterProvider router={router} />
            </GeneralContext>
        </ViewContext>
    </React.StrictMode>
);
