import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { MetadataNode } from '@utils/types';

import { ColumnContainer, OverflowContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useSelectedModels } from '@shared/Context/hooks';
import { combineData } from '@shared/Context/metadata';
import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';

import { MetaEditor } from './MetaEditor';

export function MetadataSidePanel() {
    const handlePick = (value: MetadataNode) => {};

    return (
        <ColumnContainer>
            <StretchContainer>
                <Allotment separator={false}>
                    <Allotment.Pane preferredSize={400} minSize={200}>
                        <ColumnContainer>
                            <PanelTitle title="Metadata" />
                            <OverflowContainer>
                                <MetadataHierarchy onValuePick={handlePick} />
                            </OverflowContainer>
                        </ColumnContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={800} minSize={200} className="border-l">
                        <ColumnContainer>
                            <PanelTitle title="Shared Metadata Editor" />
                            <MetaEditor />
                        </ColumnContainer>
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
