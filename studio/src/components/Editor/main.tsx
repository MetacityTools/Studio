import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ViewContext } from '@utils/utils';

import { GeneralContext } from '@elements/Context';
import { ErrorPage } from '@elements/Error';

import '@assets/index.css';

import { TablesContext } from './Context/TableContext';
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
