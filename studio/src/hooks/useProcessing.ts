import React from 'react';

import { context } from '@context/ProcessingContext';

export function useProcessing(): [boolean, (isProcessing: boolean, status?: string) => void] {
    const ctx = React.useContext(context);

    const setProcessing = (isProcessing: boolean, status?: string) => {
        ctx.setProcessing(isProcessing);
        if (status) {
            ctx.setLog((e) => [...e, status]);
        }
    };

    return [ctx.processing, setProcessing];
}
