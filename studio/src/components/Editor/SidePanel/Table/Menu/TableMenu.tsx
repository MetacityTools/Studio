import { parse } from '@vojtatom/csvts';
import * as React from 'react';
import { TbSquareRoundedNumber2Filled } from 'react-icons/tb';

import { createGroup } from '@utils/hierarchy/groupModels';

import { EditorContext } from '@editor/Context/EditorContext';
import { TablesContext } from '@editor/Context/TableContext';
import { Vitals } from '@editor/Utils/Vitals';

import { Button, ButtonFileInput } from '@elements/Button';

export function TableMenu() {
    const { renderer, scene, selectedSubmodels } = React.useContext(EditorContext);
    const { graph, nodeToMove, setNodeToMove, setTables } = React.useContext(TablesContext);

    const handleTableSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const file = files[0];
        const text = await file.text();
        const parsed = parse(text);

        setTables((tables) => {
            console.log(tables);
            return [...tables, parsed];
        });

        event.target.value = '';
        event.preventDefault();
    };

    const group = () => {
        createGroup(selectedSubmodels, graph);
    };

    const unmove = () => {
        setNodeToMove(undefined);
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 text-xs border-b">
            <Button onClick={group}>Group Selected</Button>
            {nodeToMove && <Button onClick={unmove}>Unmove</Button>}
            <ButtonFileInput id="table" onChange={handleTableSelected}>
                <TbSquareRoundedNumber2Filled className="mr-2 text-xl text-blue-500" /> Import CSV
                Table
            </ButtonFileInput>
            <Vitals scenes={[scene]} renderer={renderer} />
        </div>
    );
}
