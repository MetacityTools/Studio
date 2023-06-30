import { MetadataNode } from '@utils/types';

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
