import { Dialog } from '@headlessui/react';
import React from 'react';
import {
    TbSquareRoundedNumber1Filled,
    TbSquareRoundedNumber2Filled,
    TbSquareRoundedNumber3Filled,
} from 'react-icons/tb';

import { DialogOption, OverlayDialog } from '@elements/Dialog';

import splash from '@assets/bubny.png';

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
            <div className="mx-6 mb-4">
                <p className="text-neutral-500">v{APP_VERSION} - ⚠️ alpha release</p>
                <a
                    href="/privacy"
                    className="underline text-neutral-500 block text-xs outline-none"
                >
                    Privacy Policy
                </a>
            </div>
            <div className="mx-6 mb-8">
                <div className="flex flex-row items-center">
                    <TbSquareRoundedNumber1Filled className="mr-2 text-xl text-blue-500" />
                    import, transform, and align models
                </div>
                <div className="border-l ml-2 pl-5 border-neutral-500 border-dashed">
                    <ul className="list-disc list-inside text-sm py-2">
                        <li>SHP (only Polygons and MultiPatch)</li>
                        <li>IFC</li>
                        <li>GLTF/GLB (only triangular mesh)</li>
                    </ul>
                </div>
                <div className="flex flex-row items-center">
                    <TbSquareRoundedNumber2Filled className="mr-2 text-xl text-neutral-500" />
                    connect metadata
                </div>
                <div className="border-l h-4 ml-2 border-neutral-500 border-dashed"></div>
                <div className="flex flex-row items-center">
                    <TbSquareRoundedNumber3Filled className="mr-2 text-xl text-neutral-500" />
                    export
                </div>
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
