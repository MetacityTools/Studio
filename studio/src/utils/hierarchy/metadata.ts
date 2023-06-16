import { MetadataNode, MetadataType, MetadataValue } from '@utils/types';

import { ModelGraph } from './graph';
import { Node } from './node';
import { GroupNode } from './nodeGroup';

export function extractMetadataTree(hierarchy: ModelGraph) {
    const root = hierarchy.root;
    const tree = {};
    extractMetadata(root, tree);
    return tree;
}

function extractMetadata(node: Node, tree: MetadataNode) {
    recursiveExtractMetadata(node.data, tree);
    if (node instanceof GroupNode) for (const child of node.children) extractMetadata(child, tree);
}

function recursiveExtractMetadata(data: any, tree: MetadataNode) {
    if (typeof data === 'object') {
        for (const key in data) {
            checkChildren(tree);
            let k = key.trim();
            if (!tree.children[k]) tree.children[k] = {};
            recursiveExtractMetadata(data[k], tree.children[k]);
        }
    } else {
        checkValues(tree);
        if (typeof data === 'string') {
            tree.values.values.add(data);
            if (tree.values.type === MetadataType.NONE) tree.values.type = MetadataType.STRING;
            else if (tree.values.type !== MetadataType.STRING)
                tree.values.type = MetadataType.MIXED;
        } else if (typeof data === 'number') {
            tree.values.values.add(data);
            if (tree.values.type === MetadataType.NONE) tree.values.type = MetadataType.NUMBER;
            else if (tree.values.type !== MetadataType.NUMBER)
                tree.values.type = MetadataType.MIXED;
        } else if (typeof data === 'boolean') {
            tree.values.values.add(data);
            if (tree.values.type === MetadataType.NONE) tree.values.type = MetadataType.BOOLEAN;
            else if (tree.values.type !== MetadataType.BOOLEAN)
                tree.values.type = MetadataType.MIXED;
        }
    }
}

function checkChildren(node: MetadataNode): asserts node is MetadataNode & { children: {} } {
    if (!node.children) node.children = {};
}

function checkValues(node: MetadataNode): asserts node is MetadataNode & { values: MetadataValue } {
    if (!node.values)
        node.values = {
            type: MetadataType.NONE,
            values: new Set(),
        };
}
