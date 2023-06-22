import React from 'react';

import { useActiveSheet, useTables } from '@editor/Context/TableContext';

import { TableRow } from './Row';

const headCls = 'border-r border-b p-1 w-16 text-xs font-normal text-neutral-500 bg-neutral-100';

export function Sheet() {
    const [tables] = useTables();
    const [activeSheet] = useActiveSheet();
    const sheet = tables.getSheet(activeSheet);
    const rowTypes = tables.getSheetRowTypes(activeSheet);

    if (tables.empty) return null;

    return (
        <table className="table-fixed border-separate border-spacing-0">
            <thead>
                <tr className="sticky top-0">
                    <th className={headCls}>#</th>
                    <th className={headCls}>type</th>
                    {sheet[0].map((cell, index) => (
                        <th key={index} className={headCls}>
                            {encodeTableColumnName(index)}
                        </th>
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
                    />
                ))}
            </tbody>
        </table>
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
