import React from 'react';

import { MetadataNode, colorize, useGraph, useModels, whiten } from '@utils/utils';

export function MetadataValueStrings(props: { values: any; keyChain: string[] }) {
    return <div className="px-4">metadata strings</div>;
}

export function MetadataValueNumbers(props: { node: MetadataNode; keyChain: string[] }) {
    const { node, keyChain } = props;
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

    return (
        <div className="px-4">
            <div className="flex flex-row justify-between">
                <div className="text-xs text-gray-500">{min}</div>
                <div className="text-xs text-gray-500">{max}</div>
            </div>
        </div>
    );
}

export function MetadataValueMixed(props: { values: any; keyChain: string[] }) {
    return <div className="px-4">metadata mixed</div>;
}
