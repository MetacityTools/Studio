import * as React from 'react';

import {
    CoordinateMode,
    ModelData,
    load,
    useCreateModels,
    useRenderer,
    useScene,
} from '@utils/utils';

import { useLoadingStatus, useProcessing } from '@editor/Context/EditorContext';
import { Vitals } from '@editor/Utils/Vitals';

import { Button, ButtonFileInput } from '@elements/Button';

import { ImportDialog } from './DialogImport';

export function TransformMenu() {
    const renderer = useRenderer();
    const scene = useScene();
    const create = useCreateModels();
    const [, setProcessing] = useProcessing();
    const [, setLoadingStatus] = useLoadingStatus();

    const [importOpen, setImportOpen] = React.useState(false);
    const [importedModels, setImportedModels] = React.useState<ModelData[]>([]);

    const onModelsSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setProcessing(true);
        const models = await load(event, setLoadingStatus);
        setImportedModels(models);
        setImportOpen(true);
        setProcessing(false);
        event.target.value = '';
        event.preventDefault();
    };

    const handleModelsAdded = async (mode: CoordinateMode) => {
        setProcessing(true);
        setImportOpen(false);
        await create(importedModels, {
            coordMode: mode,
        });
        setProcessing(false);
        setImportedModels([]);
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b">
            <ButtonFileInput id="models" onChange={onModelsSelected} multiple>
                Import
            </ButtonFileInput>
            <Button>Export</Button>
            <Vitals scenes={[scene]} renderer={renderer} />
            <ImportDialog isOpen={importOpen} onClose={handleModelsAdded} />
        </div>
    );
}
