import React from 'react';

import { context } from '@context/ViewContext';

export function useStyles() {
    const ctx = React.useContext(context);
    return ctx.styles;
}
