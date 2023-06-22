import React from 'react';

import { useSheets } from '@editor/EditorContext';

import { ButtonFileInput } from '@elements/Button';

export function TableMenu() {
    const [addSheet] = useSheets();

    const handleTableSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const file = files[0];
        addSheet(await file.text());
        event.target.value = '';
        event.preventDefault();
    };

    return (
        <div className="flex flex-row p-4 w-full border-b items-center">
            <div className="flex flex-row items-center space-x-2 w-full">
                <ButtonFileInput id="table" onChange={handleTableSelected}>
                    Import CSV Table
                </ButtonFileInput>
            </div>
        </div>
    );
}
