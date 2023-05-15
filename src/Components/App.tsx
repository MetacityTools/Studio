import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ModelEditor } from './Editor/Editor';
import { ErrorPage } from './Error';
import { IntroScreen } from './Intro';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ModelEditor />,
        errorElement: <ErrorPage />,
    },
]);

export function App() {
    return <RouterProvider router={router} />;
}
