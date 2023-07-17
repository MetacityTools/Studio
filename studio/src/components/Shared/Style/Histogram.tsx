import clsx from 'clsx';
import { vec3 } from 'gl-matrix';
import React from 'react';

import { colorMapToValues } from '@utils/modifiers/color';
import { Histogram, Scalars } from '@utils/types';

interface HistogramGradientStripProps {
    style: Scalars;
    histogram: Histogram;
}

export function HistogramGradientStrip(props: HistogramGradientStripProps) {
    const { style, histogram } = props;
    const map = colorMapToValues(style.colormap);
    const gradient = getGradientStyle(map, style.min, style.max, histogram.min, histogram.max);

    const max = Math.max(...histogram.histogram);
    const bins = histogram.histogram.length;

    const TICKS_SIZE = 5;
    const xTicks = new Array(TICKS_SIZE).fill(0).map((_, i) => {
        const value = histogram.min + (i / (TICKS_SIZE - 1)) * (histogram.max - histogram.min);
        return value.toFixed(2);
    });
    console.log(xTicks);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row h-16 items-end">
                {histogram.histogram.map((value, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-gray-400 rounded-t hover:bg-gray-500"
                        title={`${value} values in range ${(
                            histogram.min +
                            (i / bins) * (histogram.max - histogram.min)
                        ).toFixed(2)} - ${(
                            histogram.min +
                            ((i + 1) / bins) * (histogram.max - histogram.min)
                        ).toFixed(2)}`}
                        style={{
                            height: `${(value / max) * 100}%`,
                        }}
                    />
                ))}
            </div>

            <div
                className="w-full h-4"
                style={{
                    background: `linear-gradient(to right, ${gradient})`,
                }}
            ></div>
            <div className="flex flex-row space-x-1 mr-1 justify-between">
                {xTicks.map((tick, i) => (
                    <div key={i} className="text-xs text-gray-500">
                        {tick}
                    </div>
                ))}
            </div>
        </div>
    );
}

function getGradientStyle(
    map: vec3[],
    valueMin: number,
    valueMax: number,
    gradientMin: number,
    gradientMax: number
) {
    const range = valueMax - valueMin;

    if (range === 0) {
        return `rgb(${map[0][0] * 255}, ${map[0][1] * 255}, ${map[0][2] * 255})`;
    }

    const percGradientMin = (gradientMin - valueMin) / range;
    const percGradientMax = (gradientMax - valueMin) / range;
    const gradientRange = percGradientMax - percGradientMin;

    return map
        .map((color, i) => {
            const percent = percGradientMin + (i / (map.length - 1)) * gradientRange;
            return `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}) ${percent * 100}%`;
        })
        .join(', ');
}
