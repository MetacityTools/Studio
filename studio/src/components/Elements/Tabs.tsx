import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

import { colorActive, colorBase } from './colors';

export function TabButton(props: { children: React.ReactNode }) {
    const base =
        'outline-none px-2 py-1 text-center transition-colors flex-1 flex flex-col items-center border-y';
    return (
        <Tab
            className={({ selected }) =>
                selected ? clsx(colorActive, base) : clsx(colorBase, base)
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
