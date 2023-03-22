import { UserInputModel } from 'types';

import IFCWorker from '@workers/IFC.worker?worker';

export function ModelInput() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const contents = await prepareContents(event);
        return processContents(contents);
    };

    return (
        <div>
            <h1>Input your models</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="model">Model</label>
                <input type="file" id="model" name="model" multiple={true} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

function processContents(contents: UserInputModel[]) {
    const worker = new IFCWorker();
    worker.onmessage = (e) => {
        console.log(e.data);
    };
    worker.postMessage(contents);
    return () => {
        worker.terminate();
    };
}

async function prepareContents(event: React.FormEvent<HTMLFormElement>) {
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
