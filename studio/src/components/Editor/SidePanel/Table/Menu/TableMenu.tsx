import * as React from 'react';

import { useRenderer, useScene } from '@utils/utils';

import { useLinkingNode, useUpdateTables } from '@editor/Context/TableContext';
import { Vitals } from '@editor/Utils/Vitals';

import { Button, ButtonFileInput } from '@elements/Button';

export function TableMenu() {
    const renderer = useRenderer();
    const scene = useScene();
    const [addSheet] = useUpdateTables();
    const [linkingNode, updateLinkingNode] = useLinkingNode();

    const handleTableSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const file = files[0];
        addSheet(await file.text());
        event.target.value = '';
        event.preventDefault();
    };

    const handleEndLinking = () => {
        updateLinkingNode(undefined);
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b items-center">
            <ButtonFileInput id="table" onChange={handleTableSelected}>
                Import CSV Table
            </ButtonFileInput>
            <Button onClick={handleEndLinking} disabled={!linkingNode}>
                End Linking
            </Button>
            <Vitals scenes={[scene]} renderer={renderer} />
        </div>
    );
}
