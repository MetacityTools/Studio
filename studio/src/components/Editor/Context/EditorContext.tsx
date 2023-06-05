import React from 'react';

import { ViewContext, ViewContextProps } from '@utils/utils';

export enum EditingStage {
    Transform,
    Table,
}

interface EditorContextProps extends ViewContextProps {
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    loadingStatus: string;
    setLoadingStatus: React.Dispatch<React.SetStateAction<string>>;
    editingStage: EditingStage;
    setEditingStage: React.Dispatch<React.SetStateAction<EditingStage>>;
}

export const EditorContext = React.createContext<EditorContextProps>({} as EditorContextProps);

export function EditorContextComponent(props: { children: React.ReactNode }) {
    const ctx = React.useContext(ViewContext);

    const [editingStage, setEditingStage] = React.useState<EditingStage>(EditingStage.Transform);
    const [loadingStatus, setLoadingStatus] = React.useState<string>('');
    const [processing, setProcessing] = React.useState(false);

    return (
        <EditorContext.Provider
            value={{
                processing,
                setProcessing,
                loadingStatus,
                setLoadingStatus,
                editingStage,
                setEditingStage,
                ...ctx,
            }}
        >
            {props.children}
        </EditorContext.Provider>
    );
}
