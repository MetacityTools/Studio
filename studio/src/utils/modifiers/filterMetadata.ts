import { MetadataNode } from '@utils/types';

export function filterMetadata(metadata: MetadataNode, nodeKey: string, query: string) {
    if (!query) return metadata;
    if (nodeKey.toLowerCase().includes(query.toLowerCase())) return metadata;

    const copy: MetadataNode = {};
    const children = new Map<string, MetadataNode>();
    const values: any[] = [];

    if (metadata.children) {
        metadata.children.forEach((child, key) => {
            const filteredChild = filterMetadata(child, key, query);
            if (filteredChild.children || filteredChild.values) children.set(key, filteredChild);
        });
    }

    if (metadata.values) {
        metadata.values.forEach((value) => {
            if (value.toString().toLowerCase().includes(query.toLowerCase())) values.push(value);
        });
    }

    if (children.size > 0) copy.children = children;
    if (values.length > 0) copy.values = values;
    return copy;
}
