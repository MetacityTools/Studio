import React from 'react';

import { MetadataNode, colorize, useGraph, useModels, whiten } from '@utils/utils';

import { useMetadata } from '@viewer/ViewerContext';

import { findPath } from './utils';

export function MetadataValueStrings(props: { values: any }) {
    return <div className="px-4">metadata strings</div>;
}

export function MetadataValueNumbers(props: { node: MetadataNode }) {
    const { node } = props;
    const [metadata] = useMetadata();
    const path = findPath(metadata, node, 'root');

    if (!path) return null;
    const keyChain = path.map((node) => node.key);

    const models = useModels();
    const [graph] = useGraph();

    let min = Infinity;
    let max = -Infinity;
    node.values?.values.forEach((value: any) => {
        min = Math.min(min, value);
        max = Math.max(max, value);
    });

    React.useEffect(() => {
        models.forEach((model) => colorize(model, graph, keyChain.slice(1), min, max));

        return () => {
            models.forEach((model) => whiten(model));
        };
    }, [node]);

    return <div className="px-4">metadata number</div>;
}

export function MetadataValueMixed(props: { values: any }) {
    return <div className="px-4">metadata mixed</div>;
}
