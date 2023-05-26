import { Dialog } from '@headlessui/react';
import React from 'react';

import { DialogOption, OverlayDialog } from '@elements/Dialog';

import splash from '@assets/office.png';

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
            <div className="mt-4 mx-6 mb-8">
                <p className="text-sm">
                    Prepare and view interactive urban visualizations in your browser. Editor
                    currently supports:
                </p>
                <ul className="list-disc list-inside text-sm mt-2">
                    <li>SHP (only Polygons and MultiPatch)</li>
                    <li>IFC</li>
                    <li>GLTF/GLB (only triangular mesh)</li>
                </ul>
            </div>
            <div className="mx-6 mt-6">
                <DialogOption
                    title="Open Editor"
                    body="Editor allows you to create a new Studio project"
                    onClick={closeModal}
                />
            </div>
            <div className="mx-6 mt-2 mb-8">
                <DialogOption
                    title="Open Viewer"
                    body="Viewer allows you to view an existing Studio project"
                    href="/view"
                />
            </div>
        </OverlayDialog>
    );
}
