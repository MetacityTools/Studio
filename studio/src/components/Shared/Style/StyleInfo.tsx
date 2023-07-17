import { Categories, Histogram, Scalars } from '@utils/types';

import { Empty } from '@elements/Empty';
import { HierarchyTitle } from '@elements/Hierarchy';

import { useApplyStyle, useStyleInfo } from '@shared/Context/hooks';

import { HistogramGradientStrip } from './Histogram';

export function StyleInfo() {
    const [histogram, style] = useStyleInfo();
    const [keychain] = useApplyStyle();

    if (!style || !keychain) return <Empty>No Style Info</Empty>;

    return (
        <div className="px-4 py-2">
            <div className="flex flex-row items-center ellipsis overflow-hidden whitespace-nowrap">
                <HierarchyTitle categories={keychain} />
            </div>
            {style.style?.scalars && histogram && (
                <ScalarValues scalars={style.style.scalars} histogram={histogram} />
            )}
            {style.style?.categories && <CategoryValues categories={style.style.categories} />}
        </div>
    );
}

function ScalarValues(props: { scalars: Scalars; histogram: Histogram }) {
    return (
        <div className="py-4">
            <HistogramGradientStrip style={props.scalars} histogram={props.histogram} />
        </div>
    );
}

function CategoryValues(props: { categories: Categories }) {
    return (
        <>
            <div className="flex flex-col">
                {Object.entries(props.categories).map(([category, color], i) => {
                    console.log(category, color);
                    return (
                        <div key={i} className="flex flex-row items-center">
                            <div
                                className="w-4 h-4 mr-2"
                                style={{
                                    background: color,
                                }}
                            />
                            <div>{category}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
