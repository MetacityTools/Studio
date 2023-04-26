import { Allotment } from 'allotment';
import React from 'react';

import { EditorModel } from '@utils/models/EditorModel';
import { loadAndAddEditorModels } from '@utils/models/addEditorModel';

import * as GL from '@bananagl/bananagl';

import { EmptyDataPanel, EmptyDetialPanel } from '@elements/Empty';

import { ActionMenu } from './SidePanel/Actions';
import { ModelDetailPanel } from './SidePanel/ModelDetail';
import { ModelList } from './SidePanel/ModelList';

export interface SidePanelProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    selection: GL.SelectionManager;
}

async function loadFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
        return [];
    }
    const fileData = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await file.arrayBuffer();
        fileData.push({ name: file.name, buffer });
    }
    return fileData;
}

export function SidePanel(props: SidePanelProps) {
    const { scene, renderer, selection } = props;

    const [models, setModels] = React.useState<EditorModel[]>([]);
    const [selectedModel, setSelectedModel] = React.useState<EditorModel | null>(null);

    const onModelSelection = (model: EditorModel | null) => {
        setSelectedModel((prev) => {
            if (prev !== null && prev !== model) prev.selected = false;
            if (model !== null && prev !== model) model.selected = true;
            if (model === null || prev !== model) selection.clearSelection();
            return model;
        });
    };

    React.useEffect(() => {
        scene.onChange = () => {
            const copy = scene.objects.filter((obj) => obj instanceof EditorModel) as EditorModel[];
            setModels(copy);
        };

        renderer.onInit = () => {
            const controls = renderer.window.controls;
            controls.onPick = (m: GL.Pickable) => {
                const model = m as EditorModel;
                onModelSelection(model);
            };
        };
    }, [scene]);

    const handleModelsAdded = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const models = await loadFiles(event);
        loadAndAddEditorModels(scene, models, selection);
    };

    return (
        <div className="text-xs bg-neutral-100 w-full h-full flex flex-col items-start">
            <ActionMenu onModelsAdd={handleModelsAdded} scene={scene} renderer={renderer} />
            <Allotment separator={false} vertical>
                <Allotment.Pane minSize={200} preferredSize={300}>
                    <div className="overflow-x-auto w-full h-full">
                        {models.length === 0 && <EmptyDataPanel />}
                        {models.length > 0 && (
                            <ModelList
                                models={models}
                                selectedModel={selectedModel}
                                selectModel={onModelSelection}
                            />
                        )}
                    </div>
                </Allotment.Pane>
                <Allotment.Pane minSize={200} className="border-t border-white">
                    <div className="overflow-x-auto w-full h-full">
                        {!selectedModel && <EmptyDetialPanel />}
                        {selectedModel && (
                            <ModelDetailPanel
                                scene={scene}
                                renderer={renderer}
                                model={selectedModel}
                                selection={selection}
                            />
                        )}
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
