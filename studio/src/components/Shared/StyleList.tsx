import React from 'react';

import { filterStyles } from '@utils/style';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { Empty } from '@elements/Empty';
import { Input } from '@elements/Input';

import { Style } from '@data/types';

import { useStyles } from '@hooks/useStyles';

import { StyleItem } from './StyleItem';

export const rootNodeLabel = 'Styles';

interface StyleListProps {
    onValuePick: (root: Style, node: Style) => void;
}

export function StyleList(props: StyleListProps) {
    const style = useStyles();
    const [fitlered, setFiltered] = React.useState<Style>(style);
    const [search, setSearch] = React.useState<string>('');
    const timerRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    React.useEffect(() => {
        setFiltered(filterStyles(style, '', search));
    }, [style, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setSearch(value);
        }, 500);
    };

    return (
        <ColumnContainer className="bg-neutral-50 dark:bg-neutral-900">
            <Input
                placeholder="Search..."
                className="px-2 bg-neutral-100 dark:bg-neutral-700 w-full"
                onChange={handleSearchChange}
            />
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    {!fitlered.children && !fitlered.style && <Empty>No Styles</Empty>}
                    {(fitlered.children || fitlered.style) && (
                        <StyleItem
                            category={rootNodeLabel}
                            node={fitlered}
                            onValuePick={(node) => props.onValuePick(fitlered, node)}
                            depth={0}
                            initialOpen={true}
                        />
                    )}
                </OverflowAbsoluteContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
