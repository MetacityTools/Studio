import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

export function TabButton(props: { children: React.ReactNode }) {
    const base = 'outline-none p-2 text-center transition-colors flex-1';
    return (
        <Tab
            className={({ selected }) =>
                selected
                    ? clsx('text-amber-600 bg-amber-100 hover:bg-amber-200', base)
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

export function TabList(props: { children: React.ReactNode }) {
    return (
        <Tab.List className="flex flex-row bg-white bg-opacity-50 absolute w-full backdrop-blur border-b border-neutral-100">
            {props.children}
        </Tab.List>
    );
}
