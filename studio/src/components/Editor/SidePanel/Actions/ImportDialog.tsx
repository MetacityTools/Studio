import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

import { CoordinateMode } from '@utils/models/addEditorModel';

import { OverlayDialog } from '@elements/Dialog';

function DialogOption(props: {
    title: string;
    body: string;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            className={clsx(
                'w-full text-left rounded-md border border-transparent bg-blue-100 px-4 py-2 text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors',
                props.className
            )}
            onClick={props.onClick}
        >
            {/* span because it is incorrect to use a div inside a button */}
            <span className="text-lg font-medium block">{props.title}</span>
            <span className="text-sm block">{props.body}</span>
        </button>
    );
}

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
