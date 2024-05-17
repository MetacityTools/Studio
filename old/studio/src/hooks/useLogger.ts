import React from 'react';

import { useLog } from './useLog';

export function useLogger() {
    const [, addToLog] = useLog();

    const log = (message: string) => {
        addToLog(message);
    };

    return log;
}
