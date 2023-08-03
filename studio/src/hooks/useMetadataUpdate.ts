import React from 'react';

import { recursiveExtractMetadata } from '@utils/metadata';

import { EditorModel } from '@data/EditorModel';
import { MetadataNode } from '@data/types';

import { context } from '@context/ViewContext';

import { useUpdateStyle } from './useStyleUpdate';

export function useUpdateMetadata() {
    const ctx = React.useContext(context);
    const updateStyle = useUpdateStyle();

    const update = (models?: EditorModel[]) => {
        const data = extractMetadata(models ?? ctx.models);
        ctx.setMetadata(data);
        //update the existing style based on the new metadata
        updateStyle(undefined, data);
    };

    return update;
}

function extractMetadata(models: EditorModel[]) {
    const aggregated: MetadataNode = {};

    models.forEach((model) => {
        Object.entries(model.metadata).forEach(([key, data]) => {
            recursiveExtractMetadata(data, aggregated);
        });
    });

    return aggregated;
}
