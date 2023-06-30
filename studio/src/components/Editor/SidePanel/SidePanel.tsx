import { Tab } from '@headlessui/react';
import 'allotment/dist/style.css';
import { VscJson, VscMove, VscSymbolColor, VscTable } from 'react-icons/vsc';

import { ColumnContainer } from '@elements/Containers';
import { TabButton, TabGroup, TabList, TabPanel, TabPanels } from '@elements/Tabs';

import { IOMenu } from '@shared/IOMenu/IOMenu';

import { MetadataSidePanel } from './Metadata/MetadataSidePanel';
import { StyleSidePanel } from './Styles/StyleSidePanel';
import { TableSidePanel } from './Tables/TableSidePanel';
import { TransformSidePanel } from './Transform/TransformSidePanel';

export function SidePanel() {
    return (
        <ColumnContainer>
            <IOMenu export />
            <TabGroup>
                <TabList>
                    <TabButton title="Transform">
                        <VscMove />
                    </TabButton>
                    <TabButton title="Metadata">
                        <VscJson />
                    </TabButton>
                    <TabButton title="Tables">
                        <VscTable />
                    </TabButton>
                    <TabButton title="Styles">
                        <VscSymbolColor />
                    </TabButton>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <TransformSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <MetadataSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <TableSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <StyleSidePanel />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </ColumnContainer>
    );
}
