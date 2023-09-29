import React from 'react';

import { Tooltip, context } from '@context/ViewContext';

export function useTooltip(): [Tooltip, React.Dispatch<React.SetStateAction<Tooltip>>] {
    const ctx = React.useContext(context);
    return [ctx.tooltip, ctx.setTooltip];
}
