import { recursiveExtractMetadata } from '@utils/metadata';

import { MetadataNode } from '@data/types';

import { SelectionType } from '@context/ViewContext';

import { useSelected } from './useSelected';

export function useMetadataSelected() {
    const selected = useSelected();
    const { common } = combineData(selected);
    return common;
}

function combineData(selection: SelectionType) {
    let recordCount = 0;
    const aggregated: MetadataNode = {};

    selection.forEach((submodels, model) => {
        submodels.forEach((submodel) => {
            const data = model.metadata[submodel] ?? {};
            recursiveExtractMetadata(data, aggregated);
            recordCount++;
        });
    });

    if (recordCount === 0) return { aggregated: {}, common: {} };
    const common = extractCommonData(aggregated, recordCount);
    return { common };
}

function extractCommonData(node: MetadataNode, expectedRecordCount: number) {
    if (node.children && node.values) {
        //node has both children and values - no need to extract
        return undefined;
    } else if (node.children) {
        const extracted: any = {};
        //node has children but no values - extract all children
        for (const [key, child] of node.children) {
            const value = extractCommonData(child, expectedRecordCount);
            if (value !== undefined) extracted[key] = value;
        }

        if (Object.keys(extracted).length === 0) return undefined;
        return extracted;
    } else if (node.values) {
        //node has values but no children - extract values
        const set = new Set(node.values);
        if (set.size === 1 && node.values.length === expectedRecordCount) {
            return set.values().next().value;
        } else {
            return undefined;
        }
    }
}
