import { Metadata } from 'data/types';
import React from 'react';

import { filterMetadata } from '@utils/metadata';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { Empty } from '@elements/Empty';
import { Input } from '@elements/Input';

import { useMetadata } from '@hooks/useMetadata';

import { MetadataItem } from './MetadataItem';

export const rootNodeLabel = 'Metadata';

interface MetadataListProps {
    onValuePick: (root: Metadata, node: Metadata, value: any) => void;
}

export function MetadataList(props: MetadataListProps) {
    const metadata = useMetadata();
    const [fitlered, setFiltered] = React.useState<Metadata>(metadata);
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
            setSearch(value);
        }, 500);
    };

    return (
        <div className="flex-1 w-full">
            <ColumnContainer>
                <Input
                    placeholder="Search..."
                    className="px-2 bg-neutral-100 dark:bg-neutral-700 w-full"
                    onChange={handleSearchChange}
                />
                <StretchContainer>
                    <OverflowAbsoluteContainer>
                        {!fitlered.children && !fitlered.values && <Empty>No metadata</Empty>}
                        {(fitlered.children || fitlered.values) && (
                            <MetadataItem
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
