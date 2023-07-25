import { HierarchyTitle } from '@elements/Hierarchy';

import { useApplyStyle, useStyle, useTooltip } from './Context/hooks';
import { getValue } from './Context/style';

export function TooltipOverlay() {
    const [tooltip] = useTooltip();
    const [style] = useApplyStyle();

    if (!tooltip || !style) return null;

    const value = getValue(tooltip.data, style);
    if (value === undefined) return null;

    return (
        <div className="w-full h-full absolute top-0 left-0 pointer-events-none">
            <div
                className="absolute pointer-events-none px-2 bg-white dark:bg-neutral-900 rounded-md"
                style={{
                    top: tooltip.y + 10,
                    left: tooltip.x + 10,
                }}
            >
                <div className="leading-none max-w-[20rem] flex flex-row items-center text-xs pt-1 text-neutral-500">
                    {style[style.length - 1]}
                </div>
                <div className="leading-none pt-1 pb-2">{value}</div>
            </div>
        </div>
    );
}
