import * as React from 'react';

import { load } from '@utils/formats/loader';
import { addEditorModels } from '@utils/models/addEditorModel';

import { EditorContext } from '@components/Editor/Context';

import { Vitals } from './Vitals';

export function ActionMenu() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) return null;
    const { renderer, scene, selection, setProcessing } = ctx;

    const handleModelsAdded = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setProcessing(true);
        const models = await load(event);
        await addEditorModels(models, selection, scene, true);
        setProcessing(false);
        event.target.value = '';
        event.preventDefault();
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 bg-neutral-100">
            <label
                htmlFor="modelInputFiles"
                className="py-2 px-4 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-colors cursor-pointer"
            >
                Import
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
            <Vitals scenes={[scene]} renderer={renderer} />
        </div>
    );
}
