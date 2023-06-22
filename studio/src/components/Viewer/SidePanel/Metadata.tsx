import { useMetadata } from '@viewer/ViewerContext';

import { Empty } from '@elements/Empty';

import { MetadataCategory } from './MetadataCategory';

export const rootNodeLabel = 'Metadata';

export function MetadataHierarchy() {
    const [metadata] = useMetadata();
    if (!metadata.children && !metadata.values)
        return (
            <div className="border-t w-full h-full">
                <Empty>No metadata</Empty>
            </div>
        );

    return (
        <div className="flex-1 h-full w-full relative border-t">
            <div className="absolute h-full w-full overflow-auto p-4">
                <MetadataCategory category={rootNodeLabel} node={metadata} depth={0} />
            </div>
        </div>
    );
}
