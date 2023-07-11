import React from 'react';

import { MetadataNode } from '@utils/types';
import { filterMetadata } from '@utils/utils';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
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
        <div className="flex-1 w-full">
            <ColumnContainer>
                <Input
                    placeholder="Search..."
                    className="px-2 bg-neutral-100 w-full"
                    onChange={handleSearchChange}
                />
                <StretchContainer>
                    <OverflowAbsoluteContainer>
                        {!fitlered.children && !fitlered.values && <Empty>No metadata</Empty>}
                        {(fitlered.children || fitlered.values) && (
                            <MetadataNodeComponent
                                category={rootNodeLabel}
                                node={fitlered}
                                onValuePick={(node, value) =>
                                    props.onValuePick(fitlered, node, value)
                                }
                                depth={0}
                                initialOpen={true}
                            />
                        )}
                    </OverflowAbsoluteContainer>
                </StretchContainer>
            </ColumnContainer>
        </div>
    );
}
