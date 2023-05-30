import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ContextComponent, HierarchyContextComponent, ViewContextComponent } from './Context';
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
            <ViewContextComponent>
                <HierarchyContextComponent>
                    <RouterProvider router={router} />
                </HierarchyContextComponent>
            </ViewContextComponent>
        </ContextComponent>
    </React.StrictMode>
);
