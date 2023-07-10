import React from 'react';

import { MetadataNode } from '@utils/types';
import { filterMetadata } from '@utils/utils';

import { Empty } from '@elements/Empty';
import { Input } from '@elements/Input';

import { useMetadata } from '@shared/Context/hooks';

import { MetadataNodeComponent } from './MetadataNode';

export const rootNodeLabel = 'Metadata';

interface MetadataHierarchyProps {
    onValuePick: (root: MetadataNode, node: MetadataNode, value: any) => void;
}

export function MetadataHierarchy(props: MetadataHierarchyProps) {
    const [metadata] = useMetadata();
    const [fitlered, setFiltered] = React.useState<MetadataNode>(metadata);
    const [search, setSearch] = React.useState<string>('');
    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    React.useEffect(() => {
        setFiltered(filterMetadata(metadata, '', search));
    }, [metadata, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            console.log(value);
            setSearch(value);
        }, 500);
    };

    return (
        <>
            <Input
                placeholder="Search..."
                className="mb-2 px-2 focus:bg-neutral-100 w-full"
                onChange={handleSearchChange}
            />
            {!fitlered.children && !fitlered.values && <Empty>No metadata</Empty>}
            {(fitlered.children || fitlered.values) && (
                <MetadataNodeComponent
                    category={rootNodeLabel}
                    node={fitlered}
                    onValuePick={(node, value) => props.onValuePick(fitlered, node, value)}
                    depth={0}
                    initialOpen={true}
                />
            )}
        </>
    );
}
