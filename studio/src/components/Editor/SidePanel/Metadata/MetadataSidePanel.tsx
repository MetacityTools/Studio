import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { MetadataNode } from '@utils/types';

import { useStatus } from '@editor/EditorContext';

import {
    BottomRowContainer,
    ColumnContainer,
    OverflowContainer,
    StretchContainer,
} from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useKeymap, useSelectedModels, useSelectionByMetadata } from '@shared/Context/hooks';
import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';
import { MetadataMenuPickFunciton } from '@shared/Metadata/MetadataValue';
import { Status } from '@shared/Status';

import { MetaEditor } from './MetaEditor';

export function MetadataSidePanel() {
    const select = useSelectionByMetadata();
    const keymap = useKeymap();
    const selection = useSelectedModels();
    const [status] = useStatus();

    const handlePick = (root: MetadataNode, node: MetadataNode, value: any) => {
        const extend = keymap?.shift ?? false;
        select(root, node, value, extend);
    };

    let countSelectedSubmodels = 0;
    selection.forEach((submodels) => {
        countSelectedSubmodels += submodels.size;
    });
    let countSelectedModels = selection.size;

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
                            <PanelTitle title="Metadata Editor" />
                            <ColumnContainer>
                                <MetaEditor />
                            </ColumnContainer>
                            <BottomRowContainer>
                                <Status status={status} />
                                Common data for {countSelectedSubmodels} submodel
                                {countSelectedSubmodels != 1 ? 's' : ''} in {countSelectedModels}{' '}
                                model{countSelectedModels != 1 ? 's' : ''}
                            </BottomRowContainer>
                        </ColumnContainer>
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
