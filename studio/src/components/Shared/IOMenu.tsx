import * as React from 'react';

import { load } from '@utils/formats/loader';

import { Button, ButtonFileInput } from '@elements/Button';

import { ModelData, Style } from '@data/types';

import { useExportModels } from '@hooks/useExportModels';
import { CoordinateMode, useImportModels } from '@hooks/useImportModels';
import { useProcessing } from '@hooks/useProcessing';
import { useRenderer } from '@hooks/useRender';
import { useScene } from '@hooks/useScene';
import { useUpdateStyles } from '@hooks/useStyleUpdate';
import { useTableAddSheet } from '@hooks/useTableAddSheet';

import { ExportDialog } from './DialogExport';
import { ImportDialog } from './DialogImport';
import { Vitals } from './Vitals';

export function IOMenu(props: { export?: boolean }) {
    const renderer = useRenderer();
    const scene = useScene();
    const updateStyle = useUpdateStyles();
    const importModels = useImportModels();
    const exportProject = useExportModels();
    const [, setProcessing] = useProcessing();
    const addSheet = useTableAddSheet();

    const [importOpen, setImportOpen] = React.useState(false);
    const [importedModels, setImportedModels] = React.useState<ModelData[]>([]);
    const [importedStyles, setImportedStyles] = React.useState<Style[]>([]);
    const [exportOpen, setExportOpen] = React.useState(false);
    const [loadStyles, setLoadStyles] = React.useState(false);

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
        } else if (styles.length > 0) updateStyle(styles[0]);

        setProcessing(false, 'Finished reading files');
        event.target.value = '';
        event.preventDefault();
    };

    const handleModelsAdded = async (mode: CoordinateMode) => {
        setProcessing(true, 'Building BVH...');
        setImportOpen(false);

        await importModels(importedModels, {
            coordMode: mode,
        });

        setLoadStyles(true);
        setProcessing(false, 'Finished loading models');
        setImportedModels([]);
    };

    React.useEffect(() => {
        if (loadStyles && importedStyles.length > 0) {
            updateStyle(importedStyles[0]);
            setImportedStyles([]);
            setLoadStyles(false);
        }
    }, [loadStyles, importedStyles]);

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
