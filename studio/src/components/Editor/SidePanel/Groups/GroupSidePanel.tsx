import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { ColumnContainer, OverflowContainer, StretchContainer } from '@elements/Containers';

import { GroupHierarchy } from './GroupHierarchy/GroupHierarchy';
import { GroupMenu } from './GroupMenu';
import { MetaEditor } from './MetaEditor';

export function GroupSidePanel() {
    return (
        <ColumnContainer>
            <GroupMenu />
            <StretchContainer>
                <Allotment separator={false}>
                    <Allotment.Pane preferredSize={400} minSize={250}>
                        <OverflowContainer className="p-4">
                            <GroupHierarchy />
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
