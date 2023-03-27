import React from 'react';
import { UserInputModel } from 'types';

import { Container } from '@components/Elements/Container';

import IFCWorker from '@workers/IFC.worker?worker';

function parseIFC(contents: UserInputModel[]) {
    return new Promise((resolve, reject) => {
        const worker = new IFCWorker();
        worker.onmessage = (e) => {
            worker.terminate();
            resolve(e.data);
        };
        worker.onerror = (e) => {
            worker.terminate();
            console.error('Error received from IFC worker');
            console.error(e);
            reject(e);
        };
        worker.postMessage(contents);
    });
}

async function loadFiles(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const files = formData.getAll('model') as File[];
    const contents = [] as UserInputModel[];
    for (const file of files) {
        contents.push({
            name: file.name,
            buffer: await file.arrayBuffer(),
        });
    }
    return contents;
}

interface ModelInputProps {
    onModelParsed: (models: any) => void;
}

export function ModelInput(props: ModelInputProps) {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const contents = await loadFiles(event);
        const models = await parseIFC(contents);
        props.onModelParsed(models);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="model">Model</label>
                <input type="file" id="model" name="model" multiple={true} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
