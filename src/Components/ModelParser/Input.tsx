import React from 'react';
import { UserInputModel } from 'types';

import IFCWorker from '@workers/IFC.worker?worker';

function parseIFC(contents: UserInputModel) {
    return new Promise((resolve, reject) => {
        const worker = new IFCWorker();
        worker.onmessage = (e) => {
            worker.terminate();
            resolve(e.data);
        };
        worker.postMessage(contents);
    });
}

async function loadFiles(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const files = formData.getAll('model') as File[];
    const contents = {
        name: files[0].name,
        buffer: await files[0].arrayBuffer(),
    };
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
                <input type="file" id="model" name="model" />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
