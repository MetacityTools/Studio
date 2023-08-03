import React from 'react';

import { loadProjectFiles } from '@utils/formats/loader';
import { CoordinateMode } from '@utils/utils';

import { useProcessing } from '@elements/GlobalContext';

import { useImportModels, useStyle } from '../../hooks/hooks';

export function ModelAutoLoader() {
    const importModels = useImportModels();
    const [_, setStyle] = useStyle();
    const [, setProcessing] = useProcessing();
    const [lstyles, setLStyles] = React.useState<any>();

    React.useEffect(() => {
        //get model param from url
        const urlParams = new URLSearchParams(window.location.search);
        const modelParam = urlParams.get('model');
        const styleParam = urlParams.get('style');

        //fetch model from url
        const load = async () => {
            let buffer, stylesData;
            const name = 'Demomodel.mcmodel';

            if (modelParam) {
                setProcessing(true, 'Loading model...');
                const modelURL = new URL(`https://${modelParam}`);
                const modelResponse = await fetch(modelURL);
                buffer = await modelResponse.arrayBuffer();
                if (styleParam) {
                    setProcessing(true, 'Loading styles...');
                    const styleURL = new URL(`https://${styleParam}`);
                    const data = await fetch(styleURL);
                    stylesData = await data.json();
                }

                setProcessing(true, 'Parsing files...');
                const { models, styles } = await loadProjectFiles(name, buffer, stylesData);

                setProcessing(true, 'Building BVH...');
                await importModels(models, {
                    coordMode: CoordinateMode.Keep,
                });

                if (styles) setLStyles(styles);
                setProcessing(false, 'Finished auto-loading models');
            }
        };

        load();
    }, []);

    React.useEffect(() => {
        if (lstyles) {
            setStyle(lstyles);
            setLStyles(undefined);
        }
    }, [lstyles]);

    return null;
}
