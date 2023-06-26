import { vec3 } from 'gl-matrix';
import React from 'react';

import {
    MetadataNode,
    MetadataNumberValue,
    MetadataStringValue,
    MetadataType,
    Style,
} from '@utils/types';

import { Empty } from '@elements/Empty';

import { useStyleKeychain, useStyles, useTraverseMetadata } from '@shared/Context/styles';
import { MetadataTitle } from '@shared/Metadata/MetadataTitle';

export function StyleDetailPanel() {
    const [keychain] = useStyleKeychain();
    const [getStyleGlobal, _, styles] = useStyles();
    const findNode = useTraverseMetadata();

    const [style, setStyle] = React.useState<Style | null>(null);
    const [node, setNode] = React.useState<MetadataNode | null>(null);

    React.useEffect(() => {
        setStyle(getStyleGlobal(keychain));
        setNode(findNode(keychain));
    }, [keychain, styles]);

    if (!style || !node) return <Empty>No metadata</Empty>;

    return (
        <div className="p-4">
            <div className="flex flex-row items-center mb-8 text-neutral-500 lowercase">
                <MetadataTitle categories={keychain} />
            </div>
            {node.values?.type === MetadataType.NUMBER && (
                <StyleDetailNumber values={node.values as MetadataNumberValue} style={style} />
            )}
            {node.values?.type === MetadataType.STRING && (
                <StyleDetailString values={node.values as MetadataStringValue} style={style} />
            )}
        </div>
    );
}

function StyleDetailNumber(props: { values: MetadataNumberValue; style: Style }) {
    return (
        <div>
            <HistogramGradientStrip map={props.style.map} values={props.values} />
        </div>
    );
}

function HistogramGradientStrip(props: {
    map: { [key: number]: vec3 };
    values: MetadataNumberValue;
}) {
    const { map, values } = props;
    const { keys, min, range, histogram, maxHistoValue } = getNumericStats(map, values);

    const gradient = keys
        .map((key) => {
            const color = props.map[key];
            const percent = (key - min) / range;
            return `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}) ${percent * 100}%`;
        })
        .join(', ');

    const style = {
        background: `linear-gradient(to right, ${gradient})`,
    };

    const ytickCount = 5;
    const yticks = new Array(ytickCount).fill(0).map((_, index) => {
        const percent = index / (ytickCount - 1);
        const value = min + percent * range;
        return value.toFixed(2);
    });

    const histogramBinWidth = range / histogram.length;

    return (
        <div className="flex flex-col">
            <div className="flex flex-row space-x-1 mr-1 justify-between">
                {yticks.map((value, index) => (
                    <div key={index} className="text-xs text-neutral-400 text-right">
                        {value}
                    </div>
                ))}
            </div>
            <div className="rounded w-full h-8" style={style}></div>
            <div className="flex flex-row w-full h-[100px] space-x-1 mt-1">
                {histogram.map((value, index) => (
                    <div
                        key={index}
                        className="flex-1 h-full rounded border bg-neutral-100"
                        style={{
                            height: `${(value * 100) / maxHistoValue}%`,
                        }}
                        title={`${value} records`}
                    ></div>
                ))}
            </div>
        </div>
    );
}

function getNumericStats(map: { [key: number]: vec3 }, values: MetadataNumberValue) {
    let keys = Object.keys(map).map((key) => Number(key));
    keys = keys.sort((a, b) => a - b);

    let min = Infinity;
    let max = -Infinity;
    for (const key of keys) {
        min = Math.min(min, key);
        max = Math.max(max, key);
    }

    let range = max - min;
    if (range === 0) range = 1;

    const bins = 10;
    const histogram = new Array(bins + 1).fill(0);
    for (const value of values.values) {
        const percent = (value - min) / range;
        const index = Math.floor(percent * bins);
        histogram[index] += 1;
    }
    const maxHistoValue = Math.max(...histogram);
    return { keys, min, range, histogram, maxHistoValue };
}

function StyleDetailString(props: { values: MetadataStringValue; style: Style }) {
    return null;
}
