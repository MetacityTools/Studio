import * as React from 'react';

import { CoordinateMode, ModelData, StyleNode, load } from '@utils/utils';

import { useSheets } from '@editor/EditorContext';

import { Button, ButtonFileInput } from '@elements/Button';
import { useProcessing } from '@elements/GlobalContext';

import { useCreateModels, useExport, useRenderer, useScene, useStyle } from '@shared/Context/hooks';
import { Vitals } from '@shared/IOMenu/Vitals';

import { ExportDialog } from './DialogExport';
import { ImportDialog } from './DialogImport';

export function IOMenu(props: { export?: boolean }) {
    const renderer = useRenderer();
    const scene = useScene();
    const [, setStyle] = useStyle();
    const create = useCreateModels();
    const exportProject = useExport();
    const [, setProcessing] = useProcessing();
    const [addSheet] = useSheets();

    const [importOpen, setImportOpen] = React.useState(false);
    const [importedModels, setImportedModels] = React.useState<ModelData[]>([]);
    const [importedStyles, setImportedStyles] = React.useState<StyleNode[]>([]);
    const [exportOpen, setExportOpen] = React.useState(false);

    const onModelsSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setProcessing(true, 'Reading files...');
        const { models, tables, styles } = await load(event, (status: string) =>
            setProcessing(true, status)
        );
        setImportedModels(models);
        tables.forEach((table) => addSheet(table));
        if (models.length > 0) {
            setImportOpen(true);
            if (styles.length > 0) setImportedStyles(styles);
        } else if (styles.length > 0) setStyle(styles[0], true);

        setProcessing(false, 'Finished reading files');
        event.target.value = '';
        event.preventDefault();
    };

    const handleModelsAdded = async (mode: CoordinateMode) => {
        setProcessing(true, 'Building BVH...');
        setImportOpen(false);

        await create(importedModels, {
            coordMode: mode,
        });
        if (importedStyles.length > 0) setStyle(importedStyles[0], true);

        setProcessing(false, 'Finished loading models');
        setImportedModels([]);
        setImportedStyles([]);
    };

    const handleExport = (title: string | null) => {
        setExportOpen(false);
        if (title === null) return;
        setProcessing(true, 'Exporting project...');
        exportProject(title);
        setProcessing(false, 'Finished exporting project');
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
                accept=".gltf, .glb, .shp, .shx, .prj, .dbf, .cpg, .metacity, .mcmodel, .mcstyle, .csv, .ifc"
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
