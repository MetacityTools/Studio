import { MetadataNode } from '@utils/types';

export type NodePath = {
    node: MetadataNode;
    key: string;
}[];

export const rootNodeLabel = 'Attributes';

export function getRoot(node: MetadataNode) {
    return {
        node,
        key: rootNodeLabel,
    };
}

export function findPath(
    node: MetadataNode,
    target: MetadataNode,
    nodeKey: string
): NodePath | null {
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
