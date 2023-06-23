import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { GeneralContext } from '@elements/Context';
import { ErrorPage } from '@elements/Error';

import { ViewContext } from '@shared/Context/Context';

import '@assets/index.css';

import { ModelEditor } from './Editor';
import { EditorContext } from './EditorContext';

const router = createBrowserRouter([
    {
        path: '/editor',
        element: <ModelEditor />,
        errorElement: <ErrorPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <GeneralContext>
            <ViewContext>
                <EditorContext>
                    <RouterProvider router={router} />
                </EditorContext>
            </ViewContext>
        </GeneralContext>
    </React.StrictMode>
);
