import React from 'react';

export enum EditingMode {
    Transform,
    Table,
}

interface EditorContextProps {
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    loadingStatus: string;
    setLoadingStatus: React.Dispatch<React.SetStateAction<string>>;
    editingMode: EditingMode;
    setEditingMode: React.Dispatch<React.SetStateAction<EditingMode>>;
}

const context = React.createContext<EditorContextProps>({} as EditorContextProps);

export function EditorContext(props: { children: React.ReactNode }) {
    const [editingMode, setEditingMode] = React.useState<EditingMode>(EditingMode.Transform);
    const [loadingStatus, setLoadingStatus] = React.useState<string>('');
    const [processing, setProcessing] = React.useState(false);

    return (
        <context.Provider
            value={{
                processing,
                setProcessing,
                loadingStatus,
                setLoadingStatus,
                editingMode,
                setEditingMode,
            }}
        >
            {props.children}
        </context.Provider>
    );
}

export function useEditorContext(): EditorContextProps {
    return React.useContext(context);
}

export function useProcessing(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const { processing, setProcessing } = useEditorContext();
    return [processing, setProcessing];
}

export function useLoadingStatus(): [string, React.Dispatch<React.SetStateAction<string>>] {
    const { loadingStatus, setLoadingStatus } = useEditorContext();
    return [loadingStatus, setLoadingStatus];
}

export function useEditingMode(): [EditingMode, React.Dispatch<React.SetStateAction<EditingMode>>] {
    const { editingMode, setEditingMode } = useEditorContext();
    return [editingMode, setEditingMode];
}
