import * as React from 'react';
import { TbSquareRoundedNumber1Filled, TbSquareRoundedNumber2Filled } from 'react-icons/tb';

import {
    CoordinateMode,
    ModelData,
    addEditorModels,
    createHierarchy,
    joinModels,
    load,
} from '@utils/utils';

import { EditingStage, EditorContext } from '@editor/Context/EditorContext';
import { TablesContext } from '@editor/Context/TableContext';
import { Vitals } from '@editor/Utils/Vitals';

import { Button, ButtonFileInput } from '@elements/Button';

import { ConvertDialog } from './DialogConvert';
import { ImportDialog } from './DialogImport';

export function TransformMenu() {
    const {
        renderer,
        scene,
        models,
        setProcessing,
        setLoadingStatus,
        setEditingStage,
        select,
        globalShift,
        setGlobalShift,
    } = React.useContext(EditorContext);
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
            const submodelCount = await joinModels(scene, models);
            const hierarchy = createHierarchy(submodelCount);

            setEditingStage(EditingStage.Table);
            setGraph(hierarchy);
            select(null);
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b">
            <ButtonFileInput id="models" onChange={onModelsSelected} multiple>
                <TbSquareRoundedNumber1Filled className="mr-2 text-xl text-blue-500" /> Import
            </ButtonFileInput>
            <Button onClick={handleConvert} disabled={models.length == 0}>
                <TbSquareRoundedNumber2Filled className="mr-2 text-xl text-blue-500" /> Convert
            </Button>
            <Vitals scenes={[scene]} renderer={renderer} />
            <ImportDialog isOpen={importOpen} onClose={handleModelsAdded} />
            <ConvertDialog isOpen={convertOpen} onClose={handleConvertRun} />
        </div>
    );
}
