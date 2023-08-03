import React from 'react';

import { context } from '@context/ProcessingContext';

export function useLog(): [string[], (message: string) => void] {
    const ctx = React.useContext(context);

    const addToLog = (message: string) => {
        ctx.setLog((e) => [...e, message]);
    };

    return [ctx.log, addToLog];
}
