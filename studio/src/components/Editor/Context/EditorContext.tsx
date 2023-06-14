import React from 'react';

export enum EditingMode {
    Transform,
    Table,
}

interface EditorContextProps {
    editingMode: EditingMode;
    setEditingMode: React.Dispatch<React.SetStateAction<EditingMode>>;
}

const context = React.createContext<EditorContextProps>({} as EditorContextProps);

export function EditorContext(props: { children: React.ReactNode }) {
    const [editingMode, setEditingMode] = React.useState<EditingMode>(EditingMode.Transform);

    return (
        <context.Provider
            value={{
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

export function useEditingMode(): [EditingMode, React.Dispatch<React.SetStateAction<EditingMode>>] {
    const { editingMode, setEditingMode } = useEditorContext();
    return [editingMode, setEditingMode];
}
