import React from 'react';

import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

export const EditorContext = React.createContext<{
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    scene: GL.Scene;
    renderer: GL.Renderer;
    selection: GL.SelectionManager;
    activeView: number;
    models: EditorModel[];
    setModels: React.Dispatch<React.SetStateAction<EditorModel[]>>;
    selectedModel: EditorModel | null;
    setSelectedModel: React.Dispatch<React.SetStateAction<EditorModel | null>>;
} | null>(null);

export function ContextComponent(props: { children: React.ReactNode }) {
    const [renderer, setRenderer] = React.useState(new GL.Renderer());
    const [scene, setScene] = React.useState(new GL.Scene());
    const [processing, setProcessing] = React.useState(false);
    const [selection, setSelection] = React.useState(new GL.SelectionManager());
    const [models, setModels] = React.useState<EditorModel[]>([]);
    const [selectedModel, setSelectedModel] = React.useState<EditorModel | null>(null);
    console.log('rendering context');

    return (
        <EditorContext.Provider
            value={{
                processing,
                setProcessing,
                scene,
                renderer,
                selection,
                activeView: 0,
                models,
                setModels,
                selectedModel,
                setSelectedModel,
            }}
        >
            {props.children}
        </EditorContext.Provider>
    );
}
