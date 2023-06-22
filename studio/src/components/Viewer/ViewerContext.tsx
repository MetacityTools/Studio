import React from 'react';

import { MetadataNode, MetadataType } from '@utils/types';
import {
    EditorModel,
    ModelGraph,
    colorize,
    extractMetadataTree,
    useModels,
    whiten,
} from '@utils/utils';
import { useGraph } from '@utils/utils';

export type NodePath = {
    node: MetadataNode;
    key: string;
}[];

interface ViewerContextProps {
    metadata: MetadataNode;
    setMetadata: React.Dispatch<React.SetStateAction<MetadataNode>>;
    style: MetadataNode | undefined;
    setStyle: React.Dispatch<React.SetStateAction<MetadataNode | undefined>>;
}

const context = React.createContext<ViewerContextProps>({} as ViewerContextProps);

export function ViewerContext(props: { children: React.ReactNode }) {
    const [metadata, setMetadata] = React.useState<MetadataNode>({});
    const [style, setStyle] = React.useState<MetadataNode | undefined>();
    const [graph] = useGraph();
    const models = useModels();

    React.useEffect(() => {
        if (graph) {
            const metadata = extractMetadataTree(graph);
            setMetadata(metadata);
            console.log(metadata);
        }
    }, [graph, setMetadata]);

    //colorize
    React.useEffect(() => {
        if (!style) {
            models.forEach((model) => whiten(model));
        } else {
            if (style.values?.type === MetadataType.NUMBER)
                colorizeNumbers(models, graph, metadata, style);
        }
    }, [style, models, graph]);

    return (
        <context.Provider
            value={{
                metadata,
                setMetadata,
                style,
                setStyle,
            }}
        >
            {props.children}
        </context.Provider>
    );
}

export function useViewerContext(): ViewerContextProps {
    return React.useContext(context);
}

export function useMetadata(): [MetadataNode, React.Dispatch<React.SetStateAction<MetadataNode>>] {
    const { metadata, setMetadata } = useViewerContext();
    return [metadata, setMetadata];
}

export function useStyle(): [
    MetadataNode | undefined,
    React.Dispatch<React.SetStateAction<MetadataNode | undefined>>
] {
    const { style, setStyle } = useViewerContext();
    return [style, setStyle];
}

function findPath(node: MetadataNode, target: MetadataNode, nodeKey: string): NodePath | null {
    if (node === target)
        return [
            {
                node,
                key: nodeKey,
            },
        ];
    if (!node.children) return null;

    for (const [key, value] of Object.entries(node.children)) {
        const path = findPath(value, target, key);
        if (path) return [{ node, key: nodeKey }, ...path];
    }

    return null;
}

function findLimits(values: Set<number>) {
    let min = Infinity;
    let max = -Infinity;
    values.forEach((value: any) => {
        min = Math.min(min, value);
        max = Math.max(max, value);
    });
    return [min, max];
}

function colorizeNumbers(
    models: EditorModel[],
    graph: ModelGraph,
    metadata: MetadataNode,
    style: MetadataNode
) {
    const path = findPath(metadata, style, 'root');
    if (!path) return;
    const keyChain = path.map((node) => node.key);
    const [min, max] = findLimits(style.values?.values as Set<number>);

    console.log(models, graph, keyChain.slice(1), min, max);
    models.forEach((model) => colorize(model, graph, keyChain.slice(1), min, max));
}
