import React from 'react';
import { Link, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ErrorPage } from './Error';
import { ModelEditor } from './ModelEditor/Editor';

function AppButon(props: { title: string; app: string }) {
    return (
        <Link to={props.app}>
            <div className="p-4 text-xl rounded-sm bg">{props.title}</div>
        </Link>
    );
}

function MainScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <AppButon title="IFC Parser" app="editor" />
        </div>
    );
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainScreen />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/editor',
        element: <ModelEditor />,
        errorElement: <ErrorPage />,
    },
]);

export function App() {
    return <RouterProvider router={router} />;
}
