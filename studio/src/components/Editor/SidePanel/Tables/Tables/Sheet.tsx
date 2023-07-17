import React from 'react';

import { useActiveSheet, useTables } from '@editor/EditorContext';

import { AssignToGeometryCallback, TableRow } from './Row';

interface SheetProps {
    assignToGeometry: AssignToGeometryCallback;
}

export function Sheet(props: SheetProps) {
    const [tables] = useTables();
    const [activeSheet] = useActiveSheet();
    const sheet = tables.getSheet(activeSheet);
    const rowTypes = tables.getSheetRowTypes(activeSheet);

    if (tables.empty) return null;

    return (
        <table className="table-fixed border-separate border-spacing-0">
            <thead>
                <tr className="sticky top-0">
                    <Th>#</Th>
                    <Th>type</Th>
                    {sheet[0].map((_, index) => (
                        <Th key={index}>{encodeTableColumnName(index)}</Th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sheet.map((row, index) => (
                    <TableRow
                        key={activeSheet + '_' + index}
                        index={index}
                        row={row}
                        rowType={rowTypes[index]}
                        assignToGeometry={props.assignToGeometry}
                    />
                ))}
            </tbody>
        </table>
    );
}

export function Th(props: { children: React.ReactNode }) {
    return (
        <th
            className={
                'border-r border-b p-1 w-16 text-xs font-normal text-neutral-500 bg-neutral-100'
            }
        >
            {props.children}
        </th>
    );
}

function encodeTableColumnName(col: number): string {
    let name = '';
    while (col >= 0) {
        name = String.fromCharCode((col % 26) + 65) + name;
        col = Math.floor(col / 26) - 1;
    }
    return name;
}
