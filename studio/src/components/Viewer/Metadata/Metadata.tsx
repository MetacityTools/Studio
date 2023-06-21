import { useMetadata } from '@viewer/ViewerContext';

import { Empty } from '@elements/Empty';

import { MetadataCategoryChildren } from './MetadataCategory';

export function MetadataHierarchy() {
    const [metadata] = useMetadata();
    if (!metadata.children && !metadata.values) return <Empty>No metadata</Empty>;

    return (
        <div className="h-full w-full overflow-auto bg-white">
            <div className="flex flex-col">
                <MetadataCategoryChildren node={metadata} depth={0} />
            </div>
        </div>
    );
}
