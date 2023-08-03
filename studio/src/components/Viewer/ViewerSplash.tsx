import { Dialog } from '@headlessui/react';
import React from 'react';

import { DialogOption, OverlayDialog } from '@elements/Dialog';

import splash from '@assets/viewer.png';

export function ViewerSplash() {
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
            <Dialog.Title as="h1" className="text-2xl font-medium leading-6 mc-text mx-6 mt-6">
                Metacity Studio Viewer
            </Dialog.Title>
            <div className="mx-6 mb-4">
                <p className="text-neutral-500">v{APP_VERSION}</p>
                <p>
                    <a href="/privacy" className="underline text-neutral-500 text-xs outline-none">
                        Privacy Policy
                    </a>
                </p>
            </div>
            <div className="mx-6">View geospatial data files in the browser</div>
            <div className="ml-2 pl-5 border-neutral-500 border-dashed">
                <ul className="list-disc list-inside text-sm py-2">
                    <li>SHP (only Polygons and MultiPatch)</li>
                    <li>IFC</li>
                    <li>GLTF/GLB (only triangular mesh)</li>
                    <li>Metacity File Format</li>
                </ul>
            </div>
            <div className="mx-6 mt-6">
                <DialogOption
                    title="Stay and use Viewer"
                    body="Viewer allows you to view an existing Studio project"
                    onClick={closeModal}
                    secondary
                />
            </div>
            <div className="mx-6 mt-2 mb-8">
                <DialogOption
                    title="Go to Editor"
                    body="Editor allows you to create a new Studio project"
                    href="/editor/"
                />
            </div>
        </OverlayDialog>
    );
}
