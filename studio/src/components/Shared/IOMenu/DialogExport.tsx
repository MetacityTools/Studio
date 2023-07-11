import { Dialog } from '@headlessui/react';
import React from 'react';

import { DialogOption, OverlayDialog } from '@elements/Dialog';
import { Input } from '@elements/Input';

export function ExportDialog(props: { isOpen: boolean; onClose: (title: string | null) => void }) {
    const { isOpen, onClose } = props;

    const [title, setTitle] = React.useState('project');

    return (
        <OverlayDialog isOpen={isOpen} onClose={() => onClose(null)}>
            <Dialog.Title
                as="h1"
                className="text-2xl font-medium leading-6 text-gray-900 mx-6 mt-6"
            >
                Export
            </Dialog.Title>
            <div className="mx-6 mt-6 text-sm">Project Title:</div>
            <div className="mx-6 my-2">
                <Input
                    placeholder="Title"
                    className="mb-2 px-4 bg-neutral-100 rounded w-full text-lg p-2"
                    onChange={(e) => setTitle(e.target.value)}
                    defaultValue={title}
                />
            </div>
            <div className="mx-6 mb-4 mt-4">
                <div className="text-sm">Exports the project as 2 files:</div>
                <div className="ml-2">
                    <ul className="list-disc list-inside text-sm py-2">
                        <li>METACITY containing geometry</li>
                        <li>JSON.METACITY containing styles</li>
                    </ul>
                </div>
                <div className="text-sm">The files can be loaded into Studio and Viewer.</div>
            </div>
            <div className="mx-6 mb-8">
                <DialogOption
                    title="Export"
                    body="Export the models with the given title."
                    onClick={() => onClose(title)}
                    className="mt-2"
                />
                <DialogOption
                    title="Cancel"
                    body=""
                    onClick={() => onClose(null)}
                    className="mt-2"
                    secondary
                />
            </div>
        </OverlayDialog>
    );
}
