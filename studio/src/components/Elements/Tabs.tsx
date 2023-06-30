import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

import { colorActive, colorActiveNoBackground, colorBase, colorBaseNoBackground } from './Colors';

export function TabButton(props: { children: React.ReactNode; title: string }) {
    const base =
        'outline-none p-4 text-center transition-colors flex flex-col items-center  overflow-hidden whitespace-nowrap overflow-ellipsis text-2xl border-l-4';
    return (
        <Tab
            className={({ selected }) =>
                selected ? clsx(colorActiveNoBackground, base) : clsx(colorBaseNoBackground, base)
            }
            title={props.title}
        >
            {props.children}
        </Tab>
    );
}

export function TabPanel(props: { children: React.ReactNode }) {
    return <Tab.Panel className="w-full h-full">{props.children}</Tab.Panel>;
}

//containers
export function TabPanels(props: { children: React.ReactNode }) {
    return <Tab.Panels className="w-full h-full flex-1">{props.children}</Tab.Panels>;
}

export function TabList(props: { children: React.ReactNode }) {
    return <Tab.List className="flex flex-col bg-white border-r">{props.children}</Tab.List>;
}

export function TabGroup(props: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row h-full">
            <Tab.Group>{props.children}</Tab.Group>
        </div>
    );
}
