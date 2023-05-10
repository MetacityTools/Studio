import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

import { EditorContext } from './Editor';

const messages = [
    'Processing your data',
    'This may take a while depending on the size of your model',
    'Thank you for your patience',
    'Please do not close this window',
];

export function ProcessingScreen() {
    const context = React.useContext(EditorContext);
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        if (context?.processing) {
            let i = 0;
            const interval = setInterval(() => {
                i++;
                setMessage(messages[i % messages.length]);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [context?.processing]);

    return (
        <Transition
            show={context?.processing}
            className="absolute top-0 left-0 w-full h-full bg-white z-50 flex items-center justify-center"
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="flex flex-col items-center space-y-4">
                <div className="text-neutral-500">
                    <p className="text-lg font-bold">{message}</p>
                </div>
            </div>
        </Transition>
    );
}
