import React from 'react';

interface GeneralContextProps {
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    log: string[];
    setLog: React.Dispatch<React.SetStateAction<string[]>>;
}

const context = React.createContext<GeneralContextProps>({} as GeneralContextProps);

export function GeneralContext(props: { children: React.ReactNode }) {
    const [log, setLog] = React.useState<string[]>(['Application initialized']);
    const [processing, setProcessing] = React.useState(false);

    return (
        <context.Provider
            value={{
                processing,
                setProcessing,
                log,
                setLog,
            }}
        >
            {props.children}
        </context.Provider>
    );
}

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

export function useLog(): [string[], (message: string) => void] {
    const ctx = React.useContext(context);

    const addToLog = (message: string) => {
        ctx.setLog((e) => [...e, message]);
    };

    return [ctx.log, addToLog];
}

export function useLogger() {
    const [, addToLog] = useLog();

    const log = React.useCallback((message: string) => {
        addToLog(message);
    }, []);

    return log;
}
