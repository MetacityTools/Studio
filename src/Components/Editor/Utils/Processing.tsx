import { Transition } from '@headlessui/react';
import React from 'react';

import { EditorContext } from '@components/Editor/Utils/Context';

import chicken1 from '@assets/chicken/Chicken_Run.gif';
import chicken3 from '@assets/chicken/Chicken_Strut.gif';

const messages = [
    'Processing your data',
    'This may take a while depending on the size of your model',
    'Thank you for your patience',
    'Please do not close this window',
];

const chickens = [chicken1, chicken3];

export function ProcessingScreen() {
    const context = React.useContext(EditorContext);
    const [message, setMessage] = React.useState(messages[0]);
    const [chicken, setChicken] = React.useState(chickens[0]);
    const { loadingStatus } = context || { loadingStatus: '' };

    React.useEffect(() => {
        if (context?.processing) {
            let i = 0;
            const interval = setInterval(() => {
                i++;
                setMessage(messages[i % messages.length]);
                setChicken(chickens[i % chickens.length]);
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
                <div className="text-neutral-500 flex flex-col items-center space-y-4">
                    <img src={chicken} className="w-12 h-12 grayscale" />
                    <p className="text-lg font-bold">{message}</p>
                    <p>{loadingStatus}</p>
                </div>
            </div>
        </Transition>
    );
}
