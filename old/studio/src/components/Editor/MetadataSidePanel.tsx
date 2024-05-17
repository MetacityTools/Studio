import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { MetadataList } from '@shared/MetadataList';

import { Metadata } from '@data/types';

import { useKeymap } from '@hooks/useKeymap';
import { useLogger } from '@hooks/useLogger';
import { useSelected } from '@hooks/useSelected';
import { useSelectionByMetadata } from '@hooks/useSelectionByMetadata';

import { MetadataEditor } from './MetadataEditor';

export function MetadataSidePanel() {
    const select = useSelectionByMetadata();
    const logger = useLogger();
    const keymap = useKeymap();
    const selection = useSelected();

    const handlePick = (root: Metadata, node: Metadata, value: any) => {
        const extend = keymap?.shift ?? false;
        select(root, node, value, extend);
    };

    React.useEffect(() => {
        let countSelectedSubmodels = 0;
        selection.forEach((submodels) => {
            countSelectedSubmodels += submodels.size;
        });
        let countSelectedModels = selection.size;
        logger(`Selected ${countSelectedSubmodels} submodels in ${countSelectedModels} models`);
    }, [selection]);

    return (
        <ColumnContainer>
            <StretchContainer>
                <Allotment separator={false} vertical>
                    <Allotment.Pane preferredSize={400} minSize={20}>
                        <ColumnContainer>
                            <PanelTitle title="Metadata Outline" />
                            <MetadataList onValuePick={handlePick} />
                        </ColumnContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={400} minSize={20} className="border-t mc-border">
                        <ColumnContainer>
                            <PanelTitle title="Metadata Editor" />
                            <ColumnContainer>
                                <StretchContainer>
                                    <OverflowAbsoluteContainer>
                                        <MetadataEditor />
                                    </OverflowAbsoluteContainer>
                                </StretchContainer>
                            </ColumnContainer>
                        </ColumnContainer>
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
