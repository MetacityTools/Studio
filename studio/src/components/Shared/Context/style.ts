import { StyleNode } from '@utils/types';
import { EditorModel } from '@utils/utils';

export function findStyleKeychain(
    node: StyleNode,
    target: StyleNode,
    nodeKey?: string
): null | string[] {
    if (node === target) {
        if (nodeKey) return [nodeKey];
        return [];
    }
    if (!node.children) return null;

    for (const [key, value] of Object.entries(node.children)) {
        const path = findStyleKeychain(value, target, key);
        if (path) {
            if (nodeKey) return [nodeKey, ...path];
            return path;
        }
    }

    return null;
}

export function colorize(keychain: string[], style: StyleNode, models: EditorModel[]) {
    models.forEach((model) => {
        //prepare colormap
        //for each record in metadata
        const metadata = model.metadata;
        const submodels = Object.keys(metadata);

        //apply colormap
    });
}
