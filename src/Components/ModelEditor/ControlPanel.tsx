import { Allotment } from 'allotment';
import React from 'react';

import { EditorModel } from '@utils/models/EditorModel';
import { addUserModels } from '@utils/models/addUserModel';

import * as GL from '@bananagl/bananagl';

import { EmptyDataPanel } from '@elements/Empty';

import { ActionMenu } from './Controls/Actions';
import { ModelList } from './Controls/ModelList';

export interface ControlsProps {
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

export function ControlPanel(props: ControlsProps) {
    const { scene, renderer, selection } = props;

    const [models, setModels] = React.useState<EditorModel[]>([]);

    React.useEffect(() => {
        scene.onChange = () => {
            const copy = scene.objects.filter((obj) => obj instanceof EditorModel) as EditorModel[];
            setModels(copy);
        };
    }, [scene]);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const models = await loadFiles(event);
        addUserModels(scene, selection, models);
    };

    return (
        <div className="text-xs bg-neutral-100 w-full h-full flex flex-col items-start">
            <ActionMenu onChange={handleChange} scene={scene} renderer={renderer} />
            <Allotment separator={false} vertical>
                <Allotment.Pane minSize={200} preferredSize={300}>
                    <div className="overflow-x-auto w-full h-full">
                        {models.length === 0 && <EmptyDataPanel />}
                        {models.length > 0 && <ModelList models={models} />}
                    </div>
                </Allotment.Pane>
                <Allotment.Pane minSize={200} className="border-t border-white">
                    <div>model detail</div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}

//<Vitals scenes={[scene]} renderer={props.renderer} />
//<div className="h-[10rem] m-4 rounded-2xl hover:shadow-even bg-white"></div>
//<div className="h-[10rem] m-4 rounded-2xl bg-white"></div>
