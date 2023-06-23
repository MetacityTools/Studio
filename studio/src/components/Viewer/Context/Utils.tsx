import { EditorModel, MetadataNode, MetadataType, ModelGraph, colorize } from '@utils/utils';

export function findKeychain(
    node: MetadataNode,
    target: MetadataNode,
    nodeKey?: string
): string[] | null {
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

export function findLimits(values: number[]) {
    let min = Infinity;
    let max = -Infinity;
    values.forEach((value: any) => {
        min = Math.min(min, value);
        max = Math.max(max, value);
    });
    return [min, max];
}

export function applyColor(
    models: EditorModel[],
    graph: ModelGraph,
    keychain: string[],
    style: MetadataNode
) {
    if (style.values?.type === MetadataType.NUMBER)
        applyColorNumber(models, graph, keychain, style);
}

function applyColorNumber(
    models: EditorModel[],
    graph: ModelGraph,
    keychain: string[],
    style: MetadataNode
) {
    const [min, max] = findLimits(style.values?.values as number[]);
    models.forEach((model) => colorize(model, graph, keychain, min, max));
}
