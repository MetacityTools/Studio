import React from 'react';
import { UserInputModel } from 'types';

async function loadFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
        return [];
    }
    const fileData = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await file.arrayBuffer();
        fileData.push({ name: file.name, buffer });
    }
    return fileData;
}

interface ModelInputProps {
    onModelAdded: (models: UserInputModel[]) => void;
}

export function ModelInputButton(props: ModelInputProps) {
    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const contents = await loadFiles(event);
        props.onModelAdded(contents);
    };

    return (
        <>
            <label htmlFor="addModels" className="cursor-pointer p-2 block">
                Add Models
            </label>
            <input
                type="file"
                id="addModels"
                name="addModels"
                multiple={true}
                onChange={handleChange}
                className="hidden"
            />
        </>
    );
}
