import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from '@elements/Error';
import { GeneralContext } from '@elements/GlobalContext';

import { ViewContext } from '@shared/Context/Context';

import '@assets/index.css';

import { ViewerContext } from './Context/ViewerContext';
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
                <ViewerContext>
                    <RouterProvider router={router} />
                </ViewerContext>
            </GeneralContext>
        </ViewContext>
    </React.StrictMode>
);
