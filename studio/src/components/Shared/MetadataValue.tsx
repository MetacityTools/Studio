import clsx from 'clsx';
import { Metadata } from 'data/types';
import React from 'react';

import { getValueOrDefault } from '@utils/placeholders';
import { isEmpty } from '@utils/predicates';

import { BracketsButton, ListButton, ListItem } from '@elements/List';

interface MetadataValueProps {
    node: Metadata;
    onValuePick: (node: Metadata, value: any) => void;
    depth?: number;
}

export function MetadataValue(props: MetadataValueProps) {
    const { node, onValuePick, depth } = props;
    const [displayCount, setDisplayCount] = React.useState(10);

    const handleUseMetadata = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: any) => {
        onValuePick(node, value);
        e.stopPropagation();
    };

    const unique = Array.from(new Set(node.values)).sort();

    return (
        <>
            {unique.slice(0, displayCount).map((value) => (
                <ListItem key={value} depth={(depth !== undefined && depth + 1) || undefined}>
                    <BracketsButton onClick={(e) => handleUseMetadata(e, value)} />
                    <ListButton
                        onClick={(e) => handleUseMetadata(e, value)}
                        className={clsx(isEmpty(value) && 'text-neutral-500')}
                    >
                        {getValueOrDefault(value)}
                    </ListButton>
                </ListItem>
            ))}
            {unique.length > displayCount && (
                <ListItem depth={(depth !== undefined && depth + 1) || undefined}>
                    <button
                        onClick={() =>
                            setDisplayCount((count) => Math.min(count + 10, unique.length))
                        }
                        className="text-neutral-300 px-2"
                    >
                        {unique.length - displayCount} more values
                    </button>
                </ListItem>
            )}
        </>
    );
}
