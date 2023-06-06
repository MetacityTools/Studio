import React from 'react';

export enum EditingStage {
    Transform,
    Table,
}

interface EditorContextProps {
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    loadingStatus: string;
    setLoadingStatus: React.Dispatch<React.SetStateAction<string>>;
    editingStage: EditingStage;
    setEditingStage: React.Dispatch<React.SetStateAction<EditingStage>>;
}

const context = React.createContext<EditorContextProps>({} as EditorContextProps);

export function EditorContext(props: { children: React.ReactNode }) {
    const [editingStage, setEditingStage] = React.useState<EditingStage>(EditingStage.Table);
    const [loadingStatus, setLoadingStatus] = React.useState<string>('');
    const [processing, setProcessing] = React.useState(false);

    return (
        <context.Provider
            value={{
                processing,
                setProcessing,
                loadingStatus,
                setLoadingStatus,
                editingStage,
                setEditingStage,
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

export function useEditingStage(): [
    EditingStage,
    React.Dispatch<React.SetStateAction<EditingStage>>
] {
    const { editingStage, setEditingStage } = useEditorContext();
    return [editingStage, setEditingStage];
}
