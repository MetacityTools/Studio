import React from 'react';

import { MetadataNode } from '@utils/types';

import { useMetadata } from '@viewer/ViewerContext';

import { MetadataBreadcrumbs } from './Breadcrumbs';
import { MetadataMenu } from './Menu';
import { NodePath, findPath, getRoot, rootNodeLabel } from './utils';

export function MetadataHierarchy() {
    const [metadata] = useMetadata();
    const [path, setPath] = React.useState<NodePath>([getRoot(metadata)]);
    React.useEffect(() => {
        setPath([getRoot(metadata)]);
    }, [metadata]);

    const handleSelect = (node: MetadataNode) => {
        const newPath = findPath(metadata, rootNodeLabel, node);
        if (newPath) setPath(newPath);
    };

    if (!metadata.children && !metadata.values) return null;

    const last = path[path.length - 1];
    const keyChain = path.map((node) => node.key);
    return (
        <div className="h-[calc(100%-50px)] mt-[50px] absolute top-0 left-0 flex flex-col">
            <MetadataBreadcrumbs path={path} setPath={setPath} />
            <MetadataMenu node={last.node} onSelect={handleSelect} keyChain={keyChain} />
        </div>
    );
}
