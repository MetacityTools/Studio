import React from 'react';

import { context } from '@context/ViewContext';

export function useMetadata() {
    const ctx = React.useContext(context);

    return ctx.metadata;
}
