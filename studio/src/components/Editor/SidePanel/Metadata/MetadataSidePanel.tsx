import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { MetadataNode } from '@utils/types';

import { useStatus } from '@editor/EditorContext';

import {
    BottomRowContainer,
    ColumnContainer,
    OverflowAbsoluteContainer,
    StretchContainer,
} from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useKeymap, useSelectedModels, useSelectionByMetadata } from '@shared/Context/hooks';
import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';
import { Status } from '@shared/Status';

import { MetaEditor } from './MetaEditor';

export function MetadataSidePanel() {
    const select = useSelectionByMetadata();
    const keymap = useKeymap();
    const selection = useSelectedModels();
    const [status, setStatus] = useStatus();

    const handlePick = (root: MetadataNode, node: MetadataNode, value: any) => {
        const extend = keymap?.shift ?? false;
        select(root, node, value, extend);
    };

    let countSelectedSubmodels = 0;
    selection.forEach((submodels) => {
        countSelectedSubmodels += submodels.size;
    });
    let countSelectedModels = selection.size;

    React.useEffect(() => {
        return () => {
            setStatus(undefined);
        };
    }, []);

    return (
        <ColumnContainer>
            <StretchContainer>
                <Allotment separator={false} vertical>
                    <Allotment.Pane preferredSize={400} minSize={20}>
                        <ColumnContainer>
                            <PanelTitle title="Metadata Outline" />
                            <MetadataHierarchy onValuePick={handlePick} />
                        </ColumnContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={400} minSize={20} className="border-t">
                        <ColumnContainer>
                            <PanelTitle title="Metadata Editor" />
                            <ColumnContainer>
                                <StretchContainer>
                                    <OverflowAbsoluteContainer>
                                        <MetaEditor />
                                    </OverflowAbsoluteContainer>
                                </StretchContainer>
                                <BottomRowContainer>
                                    <Status status={status} />
                                    <div>
                                        Common data for {countSelectedSubmodels} submodel
                                        {countSelectedSubmodels != 1 ? 's' : ''} in{' '}
                                        {countSelectedModels} model
                                        {countSelectedModels != 1 ? 's' : ''}
                                    </div>
                                </BottomRowContainer>
                            </ColumnContainer>
                        </ColumnContainer>
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
