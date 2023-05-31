import * as React from 'react';

import { parseCSV } from '@utils/tables/csv';

import { EditorContext } from '@editor/Context';

import { Input } from '@elements/Input';

import { Vitals } from './Vitals';

export function AnnotateActionMenu() {
    const ctx = React.useContext(EditorContext);
    const { renderer, scene } = ctx;

    const handleTableSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const file = files[0];
        const text = await file.text();
        const parsed = parseCSV(text);
        console.log(parsed);
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 text-xs border-b">
            <label
                htmlFor="modelInputFiles"
                className="py-2 px-4 hover:bg-neutral-300 rounded-md transition-colors cursor-pointer border"
            >
                Import Table
            </label>
            <Input
                className="hidden"
                type="file"
                onChange={handleTableSelected}
                id="modelInputFiles"
            />
            <Vitals scenes={[scene]} renderer={renderer} />
        </div>
    );
}
