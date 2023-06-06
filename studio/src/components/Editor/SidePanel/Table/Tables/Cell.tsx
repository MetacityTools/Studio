import React from 'react';

import { useTables, useUpdateTables } from '@editor/Context/TableContext';

import { CellDialog } from './CellDialog';

export function TableCell(props: {
    row: number;
    col: number;
    contents: string;
    className?: string;
}) {
    const [editing, setEditing] = React.useState(false);

    const [, activeSheet, activeRows] = useTables();
    const [, , , updateCell] = useUpdateTables();

    const handleChange = (content: string) => {
        updateCell(activeSheet, props.row, props.col, content);
        setEditing(false);
    };

    return (
        <>
            <td className={props.className} onClick={() => setEditing(true)}>
                {props.contents}
            </td>
        </>
    );
}

//<CellDialog isOpen={editing} content={props.contents} onClose={handleChange} />
