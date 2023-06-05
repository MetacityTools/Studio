import * as React from 'react';

import { EditorContext } from '@editor/Context/EditorContext';
import { TablesContext } from '@editor/Context/TableContext';
import { Vitals } from '@editor/Utils/Vitals';

import { ButtonFileInput } from '@elements/Button';

export function TableMenu() {
    const { renderer, scene } = React.useContext(EditorContext);
    const { addSheet } = React.useContext(TablesContext);

    const handleTableSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const file = files[0];
        addSheet(await file.text());
        event.target.value = '';
        event.preventDefault();
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b items-center">
            <ButtonFileInput id="table" onChange={handleTableSelected}>
                Import CSV Table
            </ButtonFileInput>
            <Vitals scenes={[scene]} renderer={renderer} />
        </div>
    );
}
