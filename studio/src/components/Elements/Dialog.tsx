import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

export function DialogOption(props: {
    title: string;
    body: string;
    onClick?: () => void;
    href?: string;
    className?: string;
}) {
    if (props.onClick) {
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

    if (props.href) {
        return (
            <a
                href={props.href}
                className={clsx(
                    'w-full text-left rounded-md border border-transparent bg-blue-100 px-4 py-2 text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors block',
                    props.className
                )}
            >
                <span className="text-lg font-medium block">{props.title}</span>
                <span className="text-sm block">{props.body}</span>
            </a>
        );
    }

    return null;
}

export function OverlayDialog(props: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const { isOpen, onClose } = props;

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {props.children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
