import React from 'react';

import { context } from '@context/ViewContext';

export function useStyleKeychain() {
    const ctx = React.useContext(context);
    return ctx.usedStyle;
}
