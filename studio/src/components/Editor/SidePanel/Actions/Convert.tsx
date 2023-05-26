import { Dialog } from '@headlessui/react';
import React from 'react';

import { CoordinateMode } from '@utils/models/addEditorModel';

import { OverlayDialog } from '@elements/Dialog';

export function ConvertDialog(props: { isOpen: boolean; onClose: (run: boolean) => void }) {
    const { isOpen, onClose } = props;

    return (
        <OverlayDialog isOpen={isOpen} onClose={() => props.onClose(false)}>
            <Dialog.Title
                as="h1"
                className="text-2xl font-medium leading-6 text-gray-900 mx-6 mt-6"
            >
                Convert Models
            </Dialog.Title>
            <div className="mx-6 mt-6 text-sm">
                In the next step, you can organize the submodels into hierarchies, add labels, and
                conect the geometry to your custom tabular data.
            </div>
            <div className="mx-6 mt-2 text-sm text-blue-900  rounded-md">
                After conversion, you won't be able to add new models or transform the geometry of
                the existing ones.
            </div>
            <div className="m-6 mt-8">
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => props.onClose(true)}
                >
                    Let's do it!
                </button>
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 ml-2"
                    onClick={() => props.onClose(false)}
                >
                    Cancel
                </button>
            </div>
        </OverlayDialog>
    );
}
