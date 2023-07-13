import { VscJson, VscSymbolColor } from 'react-icons/vsc';

import { ColumnContainer } from '@elements/Containers';
import { TabButton, TabGroup, TabList, TabPanel, TabPanels } from '@elements/Tabs';

import { IOMenu } from '@shared/IOMenu/IOMenu';

import { MetadataSidePanel } from './Metadata/MetadataSidePanel';
import { StyleSidePanel } from './Style/Styles';

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
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <MetadataSidePanel />
                    </TabPanel>
                    <TabPanel>
                        <StyleSidePanel />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </ColumnContainer>
    );
}
