import * as React from 'react';

import { CoordinateMode, ModelData, load } from '@utils/utils';

import { useSheets } from '@editor/EditorContext';

import { Button, ButtonFileInput } from '@elements/Button';
import { useLoadingStatus, useProcessing } from '@elements/Context';

import { useCreateModels, useExport, useRenderer, useScene } from '@shared/Context/hooks';
import { Vitals } from '@shared/IOMenu/Vitals';

import { ImportDialog } from './DialogImport';

export function IOMenu(props: { export?: boolean }) {
    const renderer = useRenderer();
    const scene = useScene();
    const create = useCreateModels();
    const exportProject = useExport();
    const [, setProcessing] = useProcessing();
    const [, setLoadingStatus] = useLoadingStatus();
    const [addSheet] = useSheets();

    const [importOpen, setImportOpen] = React.useState(false);
    const [importedModels, setImportedModels] = React.useState<ModelData[]>([]);

    const onModelsSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setProcessing(true);
        const { models, tables } = await load(event, setLoadingStatus);
        setImportedModels(models);
        tables.forEach((table) => addSheet(table));
        if (models.length > 0) setImportOpen(true);
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

    const handleExport = () => {
        setProcessing(true);
        exportProject();
        setProcessing(false);
    };

    return (
        <div className="flex flex-row w-full space-x-2 border-b">
            <ButtonFileInput
                id="models"
                onChange={onModelsSelected}
                multiple
                accept=".gltf, .glb, .shp, .metacity, .csv"
            >
                Import
            </ButtonFileInput>
            {props.export && <Button onClick={handleExport}>Export</Button>}
            <Vitals scenes={[scene]} renderer={renderer} />
            <ImportDialog isOpen={importOpen} onClose={handleModelsAdded} />
        </div>
    );
}
