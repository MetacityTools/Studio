import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ViewContext } from '@utils/utils';

import { EditorContext } from './Context/EditorContext';
import { TablesContext } from './Context/TableContext';
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
        <ViewContext>
            <EditorContext>
                <TablesContext>
                    <RouterProvider router={router} />
                </TablesContext>
            </EditorContext>
        </ViewContext>
    </React.StrictMode>
);
