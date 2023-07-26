import React from 'react';

interface GeneralContextProps {
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    loadingStatus: string;
    setLoadingStatus: React.Dispatch<React.SetStateAction<string>>;
}

const context = React.createContext<GeneralContextProps>({} as GeneralContextProps);

export function GeneralContext(props: { children: React.ReactNode }) {
    const [loadingStatus, setLoadingStatus] = React.useState<string>('');
    const [processing, setProcessing] = React.useState(false);

    return (
        <context.Provider
            value={{
                processing,
                setProcessing,
                loadingStatus,
                setLoadingStatus,
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
        if (status) ctx.setLoadingStatus(status);
        else ctx.setLoadingStatus('');
    };

    return [ctx.processing, setProcessing];
}

export function useLoadingStatus() {
    const ctx = React.useContext(context);
    return ctx.loadingStatus;
}
