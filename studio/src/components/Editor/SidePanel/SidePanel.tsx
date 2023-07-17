import { Tab } from '@headlessui/react';
import 'allotment/dist/style.css';
import { VscJson, VscMove, VscSymbolColor, VscTable, VscTools } from 'react-icons/vsc';

import { ColumnContainer } from '@elements/Containers';
import { TabButton, TabGroup, TabList, TabPanel, TabPanels } from '@elements/Tabs';

import { useGrayscale } from '@shared/Context/hooks';
import { IOMenu } from '@shared/IOMenu/IOMenu';
import { ViewSidePanel } from '@shared/ViewSettings/ViewSidePanel';

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
                    <TabButton title="Tables">
                        <VscTable />
                    </TabButton>
                    <TabButton title="Metadata">
                        <VscJson />
                    </TabButton>
                    <TabButton title="Styles">
                        <VscSymbolColor />
                    </TabButton>
                    <TabButton title="Settings">
                        <VscTools />
                    </TabButton>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <TransformSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <TableSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <MetadataSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <StyleSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <ViewSidePanel />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </ColumnContainer>
    );
}
