import { VscJson, VscSymbolColor, VscTools } from 'react-icons/vsc';

import { ColumnContainer } from '@elements/Containers';
import { TabButton, TabGroup, TabList, TabPanel, TabPanels } from '@elements/Tabs';

import { IOMenu } from '@shared/IOMenu';
import { StyleSidePanel } from '@shared/StyleSidePanel';
import { ViewPanel } from '@shared/ViewPanel';

import { MetadataSidePanel } from './MetadataSidePanel';

export function SidePanel() {
    return (
        <ColumnContainer>
            <IOMenu />
            <TabGroup>
                <TabList>
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
