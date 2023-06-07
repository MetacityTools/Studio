import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

import { CoordinateMode } from '@utils/models/addEditorModel';

import { DialogOption, OverlayDialog } from '@elements/Dialog';

export function ImportDialog(props: { isOpen: boolean; onClose: (mode: CoordinateMode) => void }) {
    const { isOpen, onClose } = props;

    return (
        <OverlayDialog isOpen={isOpen} onClose={() => {}}>
            <Dialog.Title
                as="h1"
                className="text-2xl font-medium leading-6 text-gray-900 mx-6 mt-6"
            >
                Transforming Coordinates
            </Dialog.Title>
            <div className="mx-6 mt-6 text-sm">
                Select how to handle coordinates of the imported models:
            </div>
            <div className="m-6 mt-8">
                <DialogOption
                    title="Keep Coordinates"
                    body="Keep the coordinates of the models as they are. Do this if you are importing georeferenced models."
                    onClick={() => onClose(CoordinateMode.Keep)}
                />
                <DialogOption
                    title="Move to Origin"
                    body="Move the models to the origin (0, 0, 0), the absolute center of the scene. Do this if you want to align the models manually."
                    onClick={() => onClose(CoordinateMode.Center)}
                    className="mt-2"
                />
            </div>
        </OverlayDialog>
    );
}
