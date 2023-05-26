import * as React from 'react';

import { load } from '@utils/formats/loader';
import { CoordinateMode, addEditorModels } from '@utils/models/addEditorModel';
import { convert } from '@utils/transforms/convert';
import { ModelData } from '@utils/types';

import { EditingStage, EditorContext, EditorViewerContext } from '@editor/Context';

import { Input } from '@elements/Input';

import { ConvertDialog } from './Convert';
import { ImportDialog } from './ImportDialog';
import { Vitals } from './Vitals';

export function ActionMenu() {
    const ctx = React.useContext(EditorContext);
    const viewerCtx = React.useContext(EditorViewerContext);
    const { renderer, scene, models, setProcessing, setLoadingStatus, setEditingStage } = ctx;
    const { globalShift, setGlobalShift } = viewerCtx;
    const [importOpen, setImportOpen] = React.useState(false);
    const [convertOpen, setConvertOpen] = React.useState(false);
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
        const shift = await addEditorModels(
            {
                models: importedModels,
                scene: scene,
                coordMode: mode,
                globalShift: globalShift,
            },
            setLoadingStatus
        );
        setProcessing(false);
        setImportedModels([]);
        setGlobalShift(shift);
    };

    const handleConvert = () => {
        setConvertOpen(true);
    };

    const handleConvertRun = async (run: boolean) => {
        setConvertOpen(false);

        if (run) {
            setEditingStage(EditingStage.Annotate);
            setProcessing(true);
            await convert(scene, models);
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 text-xs">
            <label
                htmlFor="modelInputFiles"
                className="py-2 px-4 hover:bg-neutral-300 rounded-md transition-colors cursor-pointer border"
            >
                Import
            </label>
            <Input
                className="hidden"
                type="file"
                onChange={onModelsSelected}
                id="modelInputFiles"
                multiple
            />
            <button
                className="py-2 px-4 hover:bg-neutral-300 rounded-md transition-colors border"
                onClick={handleConvert}
            >
                Convert
            </button>
            <Vitals scenes={[scene]} renderer={renderer} />
            <ImportDialog isOpen={importOpen} onClose={handleModelsAdded} />
            <ConvertDialog isOpen={convertOpen} onClose={handleConvertRun} />
        </div>
    );
}
