import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ContextComponent } from './Context/EditorContext';
import { TablesContextComponent } from './Context/TableContext';
import { TransformContextComponent } from './Context/TransformContext';
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
        <ContextComponent>
            <TransformContextComponent>
                <TablesContextComponent>
                    <RouterProvider router={router} />
                </TablesContextComponent>
            </TransformContextComponent>
        </ContextComponent>
    </React.StrictMode>
);
