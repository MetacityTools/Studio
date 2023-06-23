import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { MetadataNode } from '@utils/types';

import { ColumnContainer, OverflowContainer, StretchContainer } from '@elements/Containers';

import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';

export function StyleSidePanel() {
    const onValuePick = (value: MetadataNode) => {
        console.log(value);
    };

    return (
        <ColumnContainer>
            <StretchContainer>
                <Allotment separator={false}>
                    <Allotment.Pane preferredSize={400} minSize={300}>
                        <OverflowContainer className="p-4">
                            <MetadataHierarchy onValuePick={onValuePick} />
                        </OverflowContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={800} className="border-l">
                        TODO
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
