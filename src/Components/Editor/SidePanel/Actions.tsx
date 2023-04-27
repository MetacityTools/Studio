import * as React from 'react';

import { load } from '@utils/formats/loader';
import { addEditorModels } from '@utils/models/addEditorModel';

import * as GL from '@bananagl/bananagl';

import { Vitals } from './Vitals';

export interface ActionMenuProps {
    renderer: GL.Renderer;
    scene: GL.Scene;
    selection: GL.SelectionManager;
}

export function ActionMenu(props: ActionMenuProps) {
    const { scene, selection } = props;

    const handleModelsAdded = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const models = await load(event);
        addEditorModels(models, selection, scene, true);
        event.target.value = '';
        event.preventDefault();
    };

    return (
        <div className="flex flex-row p-4 border-b w-full border-b border-white space-x-2">
            <label
                htmlFor="modelInputFiles"
                className="py-2 px-4 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-colors cursor-pointer"
            >
                Load Models
            </label>
            <input
                className="hidden"
                type="file"
                onChange={handleModelsAdded}
                id="modelInputFiles"
                multiple
            />
            <button className="py-2 px-4 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-colors cursor-pointer">
                Export
            </button>
            <Vitals scenes={[props.scene]} renderer={props.renderer} />
        </div>
    );
}
