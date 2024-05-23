import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

export function TabButton(props: { children: React.ReactNode; title: string }) {
    return (
        <Tab
            className={({ selected }) =>
                selected ? 'active-no-background tab-button' : 'base-no-background tab-button'
            }
            title={props.title}
        >
            {props.children}
        </Tab>
    );
}

export function TabPanel(props: { children: React.ReactNode }) {
    return <Tab.Panel className="w-full h-full outline-none">{props.children}</Tab.Panel>;
}

//containers
export function TabPanels(props: { children: React.ReactNode }) {
    return <Tab.Panels className="w-full h-full flex-1">{props.children}</Tab.Panels>;
}

export function TabList(props: { children: React.ReactNode; className?: string }) {
    return (
        <Tab.List
            className={clsx(
                'flex flex-col border-r tab-list mc-background mc-border',
                props.className
            )}
        >
            {props.children}
        </Tab.List>
    );
}

export function TabGroup(props: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row h-full">
            <Tab.Group>{props.children}</Tab.Group>
        </div>
    );
}
