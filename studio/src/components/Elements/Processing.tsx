import { Transition } from '@headlessui/react';
import React from 'react';

import chicken1 from '@assets/Chicken_Run.gif';
import chicken3 from '@assets/Chicken_Strut.gif';

import { useLoadingStatus, useProcessing } from './Context';

const messages = [
    'Processing your data',
    'This may take a while depending on the size of your model',
    'Thank you for your patience',
    'Please do not close this window',
];

const chickens = [chicken1, chicken3];

export function ProcessingScreen() {
    const [loadingStatus] = useLoadingStatus();
    const [processing] = useProcessing();
    const [message, setMessage] = React.useState(messages[0]);
    const [chicken, setChicken] = React.useState(chickens[0]);

    React.useEffect(() => {
        if (processing) {
            let i = 0;
            const interval = setInterval(() => {
                i++;
                setMessage(messages[i % messages.length]);
                setChicken(chickens[i % chickens.length]);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [processing]);

    return (
        <Transition
            show={processing}
            className="absolute top-0 left-0 w-full h-full bg-white dark:bg-neutral-900 z-50 flex items-center justify-center"
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="flex flex-col items-center space-y-4">
                <div className="text-neutral-500 flex flex-col items-center space-y-4">
                    <img src={chicken} className="w-12 h-12 grayscale" />
                    <p className="text-lg font-bold">{message}</p>
                    <p>{loadingStatus}</p>
                </div>
            </div>
        </Transition>
    );
}
