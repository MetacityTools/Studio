import { MetadataNode } from '@utils/types';
import { useMetadata } from '@utils/utils';

import { Empty } from '@elements/Empty';

import { MetadataNodeComponent } from './MetadataNode';

export const rootNodeLabel = 'Metadata';

interface MetadataHierarchyProps {
    onValuePick: (value: MetadataNode) => void;
}

export function MetadataHierarchy(props: MetadataHierarchyProps) {
    const metadata = useMetadata();
    if (!metadata.children && !metadata.values) return <Empty>No metadata</Empty>;
    return (
        <MetadataNodeComponent
            category={rootNodeLabel}
            node={metadata}
            onValuePick={props.onValuePick}
        />
    );
}
