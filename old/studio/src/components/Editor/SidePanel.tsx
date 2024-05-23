import 'allotment/dist/style.css';
import { VscJson, VscMove, VscSymbolColor, VscTable, VscTools } from 'react-icons/vsc';

import { ColumnContainer } from '@elements/Containers';
import { TabButton, TabGroup, TabList, TabPanel, TabPanels } from '@elements/Tabs';

import { IOMenu } from '@shared/IOMenu';
import { StyleSidePanel } from '@shared/StyleSidePanel';
import { ViewPanel } from '@shared/ViewPanel';

import { MetadataSidePanel } from './MetadataSidePanel';
import { TableSidePanel } from './TableSidePanel';
import { TransformSidePanel } from './TransformSidePanel';

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
                        <ViewPanel />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </ColumnContainer>
    );
}
