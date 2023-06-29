import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { MetadataNode } from '@utils/types';

import { ColumnContainer, OverflowContainer, StretchContainer } from '@elements/Containers';

import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';

import { GroupHierarchy } from './GroupHierarchy/GroupHierarchy';
import { GroupMenu } from './GroupMenu';
import { MetaEditor } from './MetaEditor';

export function GroupSidePanel() {
    const handlePick = (value: MetadataNode) => {};

    return (
        <ColumnContainer>
            <GroupMenu />
            <StretchContainer>
                <Allotment separator={false}>
                    <Allotment.Pane preferredSize={400} minSize={250}>
                        <OverflowContainer className="p-4">
                            <MetadataHierarchy onValuePick={handlePick} />
                        </OverflowContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={800} className="border-l">
                        <MetaEditor />
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
