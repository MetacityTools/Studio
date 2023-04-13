import React from 'react';
import { Link, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { BrickSetEditor } from './BrickEditor/BrickEditor';
import { ErrorPage } from './Error';
import { ModelEditor } from './ModelEditor/Editor';

function AppButon(props: { title: string; app: string }) {
    return (
        <Link to={props.app}>
            <div className="p-4 text-xl rounded-sm">{props.title}</div>
        </Link>
    );
}

function MainScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <AppButon title="Brick Editor" app="brickset" />
            <AppButon title="IFC Parser" app="modelparser" />
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
        path: '/brickset',
        element: <BrickSetEditor />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/modelparser',
        element: <ModelEditor />,
        errorElement: <ErrorPage />,
    },
]);

export function App() {
    return <RouterProvider router={router} />;
}
