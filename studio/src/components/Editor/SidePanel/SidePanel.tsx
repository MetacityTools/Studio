import { Tab } from '@headlessui/react';
import 'allotment/dist/style.css';
import { VscJson, VscMove, VscTable } from 'react-icons/vsc';

import { TabButton, TabList, TabPanel } from '@elements/Tabs';

import { IOMenu } from './Menu/IOMenu';
import { MetadataSidePanel } from './Metadata/MetadataSidePanel';
import { TableSidePanel } from './Tables/TableSidePanel';
import { TransformSidePanel } from './Transform/TransformSidePanel';

export function SidePanel() {
    return (
        <div className="bg-white w-full h-screen flex flex-col">
            <IOMenu />
            <Tab.Group>
                <TabList>
                    <TabButton>
                        <VscMove className="mr-2" /> Transform
                    </TabButton>
                    <TabButton>
                        <VscJson className="mr-2" /> Metadata
                    </TabButton>
                    <TabButton>
                        <VscTable className="mr-2" /> Tables
                    </TabButton>
                </TabList>
                <Tab.Panels className="w-full h-full flex-1">
                    <TabPanel>
                        <TransformSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <MetadataSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <TableSidePanel />
                    </TabPanel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}
