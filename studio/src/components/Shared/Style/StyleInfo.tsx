import clsx from 'clsx';
import React from 'react';

import { Categories, Histogram, Scalars } from '@utils/types';

import { OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { Empty } from '@elements/Empty';

import { useApplyStyle, useStyleInfo } from '@shared/Context/hooks';

import { HistogramGradientStrip } from './Histogram';
import { CategoryStyleEditor } from './StyleCategoryEditor';

export function StyleInfo(props: { readonly?: boolean }) {
    const [histogram, style] = useStyleInfo();
    const [keychain] = useApplyStyle();

    if (!style || !keychain) return <Empty>No Style Info</Empty>;

    return (
        <>
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <div className="py-2">
                        {style.style?.scalars && histogram && (
                            <ScalarValues scalars={style.style.scalars} histogram={histogram} />
                        )}
                        {style.style?.categories && (
                            <CategoryValues
                                categories={style.style.categories}
                                readonly={props.readonly}
                            />
                        )}
                    </div>
                </OverflowAbsoluteContainer>
            </StretchContainer>
        </>
    );
}

function ScalarValues(props: { scalars: Scalars; histogram: Histogram }) {
    return (
        <div className="px-2">
            <HistogramGradientStrip style={props.scalars} histogram={props.histogram} />
        </div>
    );
}

function CategoryValues(props: { categories: Categories; readonly?: boolean }) {
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
                        readonly={props.readonly}
                    />
                );
            })}
        </div>
    );
}

function CategoryValue(props: { category: string; color: string; readonly?: boolean }) {
    const { category, color } = props;
    const [editing, setEditing] = React.useState(false);

    return (
        <>
            <button
                className={clsx(
                    'px-2 flex flex-row items-center text-left',
                    'overflow-hidden whitespace-nowrap',
                    editing && (props.readonly ? 'button-list-readonly' : 'button-list'),
                    !editing && !props.readonly && 'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                    props.readonly && 'cursor-default'
                )}
                onClick={() => {
                    setEditing((e) => !e && !props.readonly);
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
                        !category && 'text-neutral-500'
                    )}
                >
                    {category ? category : 'No title'}
                </span>
            </button>
            {editing && !props.readonly && <CategoryStyleEditor {...props} />}
        </>
    );
}
