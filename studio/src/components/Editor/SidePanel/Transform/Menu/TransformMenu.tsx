import * as React from 'react';

import { load } from '@utils/formats/loader';
import { CoordinateMode, addEditorModels } from '@utils/models/addEditorModel';
import { convert } from '@utils/transforms/convert';
import { ModelData } from '@utils/types';

import { EditingStage, EditorContext } from '@editor/Context/EditorContext';
import { TablesContext } from '@editor/Context/TableContext';
import { TransformContext } from '@editor/Context/TransformContext';
import { Vitals } from '@editor/Utils/Vitals';

import { Button, ButtonFileInput } from '@elements/Button';

import { ConvertDialog } from './DialogConvert';
import { ImportDialog } from './DialogImport';

export function TransformMenu() {
    const { renderer, scene, models, setProcessing, setLoadingStatus, setEditingStage, select } =
        React.useContext(EditorContext);
    const { globalShift, setGlobalShift } = React.useContext(TransformContext);
    const { setGraph } = React.useContext(TablesContext);

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
            setProcessing(true);

            await new Promise((resolve) => setTimeout(resolve, 1000));
            const { hierarchy } = await convert(scene, models);

            setEditingStage(EditingStage.Table);
            setGraph(hierarchy);
            select(null);
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b">
            <ButtonFileInput id="models" onChange={onModelsSelected}>
                Import
            </ButtonFileInput>
            <Button onClick={handleConvert}>Convert to Tables</Button>
            <Vitals scenes={[scene]} renderer={renderer} />
            <ImportDialog isOpen={importOpen} onClose={handleModelsAdded} />
            <ConvertDialog isOpen={convertOpen} onClose={handleConvertRun} />
        </div>
    );
}
