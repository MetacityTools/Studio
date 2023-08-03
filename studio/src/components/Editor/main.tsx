import { ViewContext } from '@context/ViewContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from '@elements/Error';
import { GeneralContext } from '@elements/GlobalContext';

import '@assets/index.css';

import { TablesContext } from '../../context/TablesContext';
import { ModelEditor } from './Editor';

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
                <TablesContext>
                    <RouterProvider router={router} />
                </TablesContext>
            </ViewContext>
        </GeneralContext>
    </React.StrictMode>
);
