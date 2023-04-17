import React from 'react';

import { loadModels } from '@utils/formats/loader';
import { EditorModel } from '@utils/models/EditorModel';
import { UserModels } from '@utils/models/UserModel';

import * as GL from '@bananagl/bananagl';

import { EmptyDataPanel } from '@elements/Empty';

import { ActionMenu } from './Controls/Actions';
import { ModelList } from './Controls/ModelList';
import { Vitals } from './Controls/Vitals';

export interface ControlsProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
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
    const { scene } = props;

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
        UserModels(scene, models);
    };

    return (
        <div className="text-xs bg-neutral-100 w-full h-full flex flex-col items-start">
            <ActionMenu onChange={handleChange} />
            <div className="overflow-x-auto w-full h-full">
                {models.length === 0 && <EmptyDataPanel />}
                {models.length > 0 && <ModelList models={models} />}
            </div>
        </div>
    );
}

//<Vitals scenes={[scene]} renderer={props.renderer} />
//<div className="h-[10rem] m-4 rounded-2xl hover:shadow-even bg-white"></div>
//<div className="h-[10rem] m-4 rounded-2xl bg-white"></div>
