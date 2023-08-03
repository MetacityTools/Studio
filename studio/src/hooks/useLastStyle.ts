import React from 'react';

import { context } from '@context/ViewContext';

import { useApplyStyle } from './useApplyStyle';

export function useLastStyle(): [string[] | null, () => void] {
    const ctx = React.useContext(context);
    const [, applyStyle] = useApplyStyle();

    const applyLastStyle = () => {
        if (!ctx.lastUsedStyle) return;
        applyStyle(ctx.lastUsedStyle);
    };

    return [ctx.lastUsedStyle, applyLastStyle];
}
