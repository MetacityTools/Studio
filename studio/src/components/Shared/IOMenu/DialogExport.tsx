import { Dialog } from '@headlessui/react';
import React from 'react';

import { DialogButton, OverlayDialog } from '@elements/Dialog';
import { Input } from '@elements/Input';

export function ExportDialog(props: { isOpen: boolean; onClose: (title: string | null) => void }) {
    const { isOpen, onClose } = props;

    const [title, setTitle] = React.useState('project');

    return (
        <OverlayDialog isOpen={isOpen} onClose={() => onClose(null)}>
            <Dialog.Title as="h1" className="text-2xl font-medium mc-text leading-6  mx-6 mt-6">
                Export
            </Dialog.Title>
            <div className="mx-6 mt-6">Enter project title</div>
            <div className="mx-6 my-2">
                <Input
                    placeholder="Title"
                    className="mb-2 px-4 bg-blue-100 dark:bg-blue-900 rounded w-full text-lg p-2"
                    onChange={(e) => setTitle(e.target.value)}
                    defaultValue={title}
                />
            </div>
            <div className="mx-6 mb-6 mt-4 text-sm">
                <div>Exports the project as 2 files:</div>
                <div className="ml-2">
                    <ul className="list-disc list-inside py-2">
                        <li>.mcmodel containing geometry</li>
                        <li>.mcstyle containing styles</li>
                    </ul>
                </div>
                <div>The files can be loaded into Studio and Viewer.</div>
            </div>
            <div className="mx-6 mb-8 flex flex-row space-x-2">
                <DialogButton
                    body="Export"
                    title="Export the models with the given title."
                    onClick={() => onClose(title)}
                    className="mt-2"
                />
                <DialogButton
                    title="Cancel export."
                    body="Cancel"
                    onClick={() => onClose(null)}
                    className="mt-2"
                    secondary
                />
            </div>
        </OverlayDialog>
    );
}
