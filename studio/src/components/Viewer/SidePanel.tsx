import { VscJson, VscSymbolColor, VscTools } from 'react-icons/vsc';

import { ColumnContainer } from '@elements/Containers';
import { TabButton, TabGroup, TabList, TabPanel, TabPanels } from '@elements/Tabs';

import { useGrayscale } from '@shared/Context/hooks';
import { IOMenu } from '@shared/IOMenu/IOMenu';
import { ViewSidePanel } from '@shared/ViewSettings/ViewSidePanel';

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
                        <ViewSidePanel />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </ColumnContainer>
    );
}
