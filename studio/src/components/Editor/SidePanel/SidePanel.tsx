import { Tab } from '@headlessui/react';
import 'allotment/dist/style.css';
import { VscJson, VscMove, VscSymbolColor, VscTable } from 'react-icons/vsc';

import { ColumnContainer } from '@elements/Containers';
import { TabButton, TabList, TabPanel } from '@elements/Tabs';

import { IOMenu } from '@shared/IOMenu/IOMenu';

import { GroupSidePanel } from './Groups/GroupSidePanel';
import { StyleSidePanel } from './Styles/StyleSidePanel';
import { TableSidePanel } from './Tables/TableSidePanel';
import { TransformSidePanel } from './Transform/TransformSidePanel';

export function SidePanel() {
    return (
        <ColumnContainer>
            <IOMenu export />
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
                    <TabButton>
                        <VscSymbolColor className="mr-2" /> Styles
                    </TabButton>
                </TabList>
                <Tab.Panels className="w-full h-full">
                    <TabPanel>
                        <TransformSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <GroupSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <TableSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <StyleSidePanel />
                    </TabPanel>
                </Tab.Panels>
            </Tab.Group>
        </ColumnContainer>
    );
}
