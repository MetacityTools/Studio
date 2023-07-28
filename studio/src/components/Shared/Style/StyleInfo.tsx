import { VscSymbolColor } from 'react-icons/vsc';

import { Categories, Histogram, Scalars } from '@utils/types';

import { OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { Empty } from '@elements/Empty';
import { HierarchyTitle } from '@elements/Hierarchy';

import { useApplyStyle, useStyleInfo } from '@shared/Context/hooks';

import { HistogramGradientStrip } from './Histogram';

export function StyleInfo() {
    const [histogram, style] = useStyleInfo();
    const [keychain] = useApplyStyle();

    if (!style || !keychain) return <Empty>No Style Info</Empty>;

    return (
        <>
            <div className="px-2 flex flex-row items-center ellipsis overflow-hidden whitespace-nowrap border-b border-dotted mc-border">
                <HierarchyTitle categories={keychain} />
            </div>
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <div className="py-2">
                        {style.style?.scalars && histogram && (
                            <ScalarValues scalars={style.style.scalars} histogram={histogram} />
                        )}
                        {style.style?.categories && (
                            <CategoryValues categories={style.style.categories} />
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

function CategoryValues(props: { categories: Categories }) {
    return (
        <div className="flex flex-col">
            {Object.entries(props.categories).map(([category, color], i) => {
                return (
                    <div
                        key={i}
                        className="px-2 flex flex-row items-center hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                        <div
                            className="w-4 h-4 mr-2 rounded border border-neutral-500 "
                            style={{
                                background: color,
                            }}
                        />
                        {category ? (
                            <div>{category}</div>
                        ) : (
                            <div className="text-neutral-400 dark:text-neutral-500">Empty name</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
