import * as React from 'react';

import { CoordinateMode, ModelData, load } from '@utils/utils';

import { useSheets } from '@editor/EditorContext';

import { Button, ButtonFileInput } from '@elements/Button';
import { useLoadingStatus, useProcessing } from '@elements/Context';

import { useCreateModels, useExport, useRenderer, useScene, useStyle } from '@shared/Context/hooks';
import { Vitals } from '@shared/IOMenu/Vitals';

import { ExportDialog } from './DialogExport';
import { ImportDialog } from './DialogImport';

export function IOMenu(props: { export?: boolean }) {
    const renderer = useRenderer();
    const scene = useScene();
    const [style, setStyle] = useStyle();
    const create = useCreateModels();
    const exportProject = useExport();
    const [, setProcessing] = useProcessing();
    const [, setLoadingStatus] = useLoadingStatus();
    const [addSheet] = useSheets();

    const [importOpen, setImportOpen] = React.useState(false);
    const [importedModels, setImportedModels] = React.useState<ModelData[]>([]);
    const [exportOpen, setExportOpen] = React.useState(false);

    const onModelsSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setProcessing(true);
        const { models, tables, styles } = await load(event, setLoadingStatus);
        setImportedModels(models);
        tables.forEach((table) => addSheet(table));
        styles.length > 0 && setStyle(styles[0]); //use only the first style imported
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

    const handleExport = (title: string | null) => {
        setExportOpen(false);
        if (title === null) return;
        setProcessing(true);
        exportProject(title);
        setProcessing(false);
    };

    const handleOpenExport = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setExportOpen(true);
        e.preventDefault();
    };

    return (
        <div className="flex flex-row w-full space-x-2 border-b mc-border min-w-[25rem]">
            <ButtonFileInput
                id="models"
                onChange={onModelsSelected}
                multiple
                accept=".gltf, .glb, .shp, .shx, .prj, .dbf, .cpg, .metacity, .csv, .ifc"
            >
                Import
            </ButtonFileInput>
            {props.export && <Button onClick={handleOpenExport}>Export</Button>}
            <Vitals scenes={[scene]} renderer={renderer} />
            <ImportDialog isOpen={importOpen} onClose={handleModelsAdded} />
            <ExportDialog isOpen={exportOpen} onClose={handleExport} />
        </div>
    );
}
