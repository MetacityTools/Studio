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

interface ViewerContextProps {
    metadata: MetadataNode;
    setMetadata: React.Dispatch<React.SetStateAction<MetadataNode>>;
    style: MetadataNode | undefined;
    keychain: string[];
    setStyle: React.Dispatch<React.SetStateAction<MetadataNode | undefined>>;
}

const context = React.createContext<ViewerContextProps>({} as ViewerContextProps);

export function ViewerContext(props: { children: React.ReactNode }) {
    const [metadata, setMetadata] = React.useState<MetadataNode>({});
    const [style, setStyle] = React.useState<MetadataNode | undefined>();
    const [keychain, setKeychain] = React.useState<string[]>([]);
    const [graph] = useGraph();
    const models = useModels();

    React.useEffect(() => {
        if (graph) {
            const metadata = extractMetadataTree(graph);
            setMetadata(metadata);
        }
    }, [graph, setMetadata]);

    //colorize
    React.useEffect(() => {
        if (!style) {
            models.forEach((model) => whiten(model));
        } else {
            const keychain = findKeychain(metadata, style);
            if (!keychain) return;
            if (style.values?.type === MetadataType.NUMBER)
                colorizeNumbers(models, graph, keychain, style);
            setKeychain(keychain);
        }
    }, [style, models, graph]);

    return (
        <context.Provider
            value={{
                metadata,
                setMetadata,
                style,
                keychain,
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
    string[],
    React.Dispatch<React.SetStateAction<MetadataNode | undefined>>
] {
    const { style, keychain, setStyle } = useViewerContext();
    return [style, keychain, setStyle];
}

function findKeychain(node: MetadataNode, target: MetadataNode, nodeKey?: string): string[] | null {
    if (node === target) {
        if (nodeKey) return [nodeKey];
        return [];
    }
    if (!node.children) return null;

    for (const [key, value] of Object.entries(node.children)) {
        const path = findKeychain(value, target, key);
        if (path) {
            if (nodeKey) return [nodeKey, ...path];
            return path;
        }
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
    keychain: string[],
    style: MetadataNode
) {
    const [min, max] = findLimits(style.values?.values as Set<number>);
    models.forEach((model) => colorize(model, graph, keychain, min, max));
}
