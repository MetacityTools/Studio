import { Dialog, Transition } from '@headlessui/react';
import React from 'react';

import { OverlayDialog } from '@elements/Dialog';

import splash from '@assets/splash/office3.png';

export function SpashScreen() {
    let [isOpen, setIsOpen] = React.useState(true);

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <OverlayDialog isOpen={isOpen} onClose={closeModal}>
            <div
                className="w-full h-64 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${splash})`,
                }}
            ></div>
            <Dialog.Title
                as="h1"
                className="text-2xl font-medium leading-6 text-gray-900 mx-6 mt-6"
            >
                Metacity Studio
            </Dialog.Title>
            <div className="mx-6">
                <p className="text-neutral-500">v{APP_VERSION} - ⚠️ alpha release</p>
            </div>
            <div className="mx-6 mt-4">
                <p className="text-sm">
                    View, transform, and split models in your browser. Currently supported formats:
                </p>
                <ul className="list-disc list-inside text-sm mt-2">
                    <li>SHP (only Polygons and MultiPatch)</li>
                    <li>IFC</li>
                    <li>GLTF/GLB (only triangular mesh)</li>
                </ul>
            </div>
            <div className="m-6 mt-8">
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                >
                    Let's start!
                </button>
            </div>
        </OverlayDialog>
    );
}
