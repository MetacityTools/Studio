import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ViewContextComponent } from '@utils/utils';

import { EditorContextComponent } from './Context/EditorContext';
import { TablesContextComponent } from './Context/TableContext';
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
        <ViewContextComponent>
            <EditorContextComponent>
                <TablesContextComponent>
                    <RouterProvider router={router} />
                </TablesContextComponent>
            </EditorContextComponent>
        </ViewContextComponent>
    </React.StrictMode>
);
