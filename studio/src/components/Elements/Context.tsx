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

export function useViewerContext(): GeneralContextProps {
    return React.useContext(context);
}

export function useProcessing(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const { processing, setProcessing } = useViewerContext();
    return [processing, setProcessing];
}

export function useLoadingStatus(): [string, React.Dispatch<React.SetStateAction<string>>] {
    const { loadingStatus, setLoadingStatus } = useViewerContext();
    return [loadingStatus, setLoadingStatus];
}
