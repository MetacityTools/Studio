import React from 'react';

import { TableRow } from './TableRow';

function encodeTableColumnName(col: number): string {
    let name = '';
    while (col >= 0) {
        name = String.fromCharCode((col % 26) + 65) + name;
        col = Math.floor(col / 26) - 1;
    }
    return name;
}

export function Table(props: {
    table: string[][];
    selectedRows: Set<number>;
    onUpdateValue: (row: number, col: number, value: string) => void;
    onSelectRow: (row: number) => void;
}) {
    const { table, onUpdateValue, selectedRows, onSelectRow } = props;

    const headCls =
        'border-r border-b p-1 w-16 text-xs font-normal text-neutral-500 bg-neutral-100';

    return (
        <table className="table-fixed border-separate border-spacing-0">
            <thead>
                <tr className="sticky top-0">
                    <th className={headCls}>#</th>
                    {table[0].map((cell, index) => (
                        <th key={index} className={headCls}>
                            {encodeTableColumnName(index)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {table.map((row, indexRow) => (
                    <TableRow
                        key={indexRow}
                        indexRow={indexRow}
                        row={row}
                        onUpdateValue={onUpdateValue}
                        selected={selectedRows.has(indexRow)}
                        onSelect={() => onSelectRow(indexRow)}
                    />
                ))}
            </tbody>
        </table>
    );
}
