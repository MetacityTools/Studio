import { MetadataNode } from '@utils/types';

import { Empty } from '@elements/Empty';

import { useMetadata } from '@shared/Context/hooks';

import { MetadataNodeComponent } from './MetadataNode';

export const rootNodeLabel = 'Metadata';

interface MetadataHierarchyProps {
    onValuePick: (node: MetadataNode, value: any) => void;
}

export function MetadataHierarchy(props: MetadataHierarchyProps) {
    const [metadata] = useMetadata();
    if (!metadata.children && !metadata.values) return <Empty>No metadata</Empty>;
    return (
        <MetadataNodeComponent
            category={rootNodeLabel}
            node={metadata}
            onValuePick={props.onValuePick}
            depth={0}
            initialOpen={true}
        />
    );
}
