import { Transition } from '@headlessui/react';
import React from 'react';

import { loadProjectFiles } from '@utils/formats/loader';
import { CoordinateMode } from '@utils/utils';

import { useProcessing } from '@elements/GlobalContext';

import { useCreateModels, useStyle } from './Context/hooks';

export function ModelAutoLoader() {
    const create = useCreateModels();
    const [_, setStyle] = useStyle();
    const [, setProcessing] = useProcessing();

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
                await create(models, {
                    coordMode: CoordinateMode.Keep,
                });
                if (styles) setStyle(styles);
                setProcessing(false, 'Finished auto-loading models');
            }
        };

        load();
    }, []);

    return null;
}
