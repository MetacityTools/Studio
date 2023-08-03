import clsx from 'clsx';
import { Categories } from 'data/types';
import React from 'react';

import { getValueOrDefault } from '@utils/placeholders';
import { isEmpty } from '@utils/predicates';

import { CategoryStyleEditor } from './StyleCategoryEditor';

export function StyleCategoryList(props: { categories: Categories }) {
    const e = Object.entries(props.categories);
    e.sort((a, b) => a[0].localeCompare(b[0]));
    return (
        <div className="flex flex-col">
            {e.map(([category, color], i) => {
                return (
                    <CategoryValue
                        key={category + i}
                        category={category}
                        color={color}
                        categories={props.categories}
                    />
                );
            })}
        </div>
    );
}

interface CategoryValueProps {
    category: string;
    color: string;
    categories: Categories;
}

function CategoryValue(props: CategoryValueProps) {
    const [editing, setEditing] = React.useState(false);

    return (
        <>
            <CategoryButton {...props} editing={editing} setEditing={setEditing} />
            {editing && <CategoryStyleEditor {...props} />}
        </>
    );
}

interface CategoryButtonProps extends CategoryValueProps {
    editing: boolean;
    setEditing: (e: boolean) => void;
}

function CategoryButton(props: CategoryButtonProps) {
    const { category, color, editing, setEditing } = props;

    return (
        <button
            className={clsx(
                'px-2 flex flex-row items-center text-left',
                'overflow-hidden whitespace-nowrap',
                editing && 'button-list',
                !editing && 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
            )}
            onClick={() => {
                setEditing(!editing);
            }}
        >
            <span className="block shrink-0">
                <span
                    className="block w-4 h-4 mr-2 rounded dark:ring-1 dark:ring-inset dark:ring-white/10"
                    style={{
                        background: color,
                    }}
                />
            </span>
            <span
                className={clsx(
                    'block whitespace-nowrap overflow-hidden overflow-ellipsis',
                    isEmpty(category) && 'text-neutral-500'
                )}
            >
                {getValueOrDefault(category)}
            </span>
        </button>
    );
}
