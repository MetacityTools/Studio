import React from 'react';

interface ProcessingContextProps {
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    log: string[];
    setLog: React.Dispatch<React.SetStateAction<string[]>>;
}

export const context = React.createContext<ProcessingContextProps>({} as ProcessingContextProps);

export function ProcessingContext(props: { children: React.ReactNode }) {
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
