import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

export function TabButton(props: { children: React.ReactNode }) {
    const base = 'outline-none p-2 text-center transition-colors flex-1 rounded';
    return (
        <Tab
            className={({ selected }) =>
                selected
                    ? clsx('text-green-600 bg-green-100 hover:bg-green-200', base)
                    : clsx('text-neutral-600 bg-none hover:bg-neutral-300', base)
            }
        >
            {props.children}
        </Tab>
    );
}

export function TabPanel(props: { children: React.ReactNode }) {
    return <Tab.Panel className="overflow-x-auto w-full h-full pt-12">{props.children}</Tab.Panel>;
}
