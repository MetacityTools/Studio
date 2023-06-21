import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

export function TabButton(props: { children: React.ReactNode }) {
    const base =
        'outline-none px-2 py-1 text-center transition-colors flex-1 flex flex-col items-center border-y';
    return (
        <Tab
            className={({ selected }) =>
                selected
                    ? clsx('text-amber-600 bg-amber-100 hover:bg-amber-200 border-amber-400', base)
                    : clsx('text-neutral-600 bg-none hover:bg-amber-300 hover:text-amber-800', base)
            }
        >
            <span className="block flex flex-row items-center text-center">{props.children}</span>
        </Tab>
    );
}

export function TabPanel(props: { children: React.ReactNode }) {
    return <Tab.Panel className="w-full h-full">{props.children}</Tab.Panel>;
}

export function TabList(props: { children: React.ReactNode }) {
    return <Tab.List className="flex flex-row bg-white w-full">{props.children}</Tab.List>;
}
