import clsx from 'clsx';

import { getValueOrDefault } from '@utils/placeholders';
import { isEmpty } from '@utils/predicates';

import { useStyleKeychain, useTooltip } from './Context/hooks';
import { getValue } from './Context/style';

export function TooltipOverlay() {
    const [tooltip] = useTooltip();
    const keychain = useStyleKeychain();

    if (!tooltip || !keychain) return null;

    const value = getValue(tooltip.data, keychain);
    if (value === undefined) return null;

    return (
        <div className="w-full h-full absolute top-0 left-0 pointer-events-none">
            <div
                className="absolute pointer-events-none px-2 py-2 bg-white dark:bg-neutral-900 rounded-md"
                style={{
                    top: tooltip.y + 10,
                    left: tooltip.x + 10,
                }}
            >
                <div className="leading-none max-w-[20rem] flex flex-row items-center text-xs text-neutral-500">
                    {keychain[keychain.length - 1]}
                </div>
                <div className={clsx('leading-none pt-1', isEmpty(value) && 'text-neutral-500')}>
                    {getValueOrDefault(value)}
                </div>
            </div>
        </div>
    );
}
