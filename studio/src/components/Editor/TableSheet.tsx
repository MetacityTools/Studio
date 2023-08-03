import React from 'react';

import { useTabelsEmpty } from '@hooks/useTabeIsEmpty';
import { useTableSheet } from '@hooks/useTableActiveSheet';
import { useTableRowTypes } from '@hooks/useTableRowTypes';
import { useTableSheetIndex } from '@hooks/useTableSheetIndex';

import { AssignToGeometryCallback, TableRow } from './TableRow';

interface SheetProps {
    assignToGeometry: AssignToGeometryCallback;
}

export function Sheet(props: SheetProps) {
    const empty = useTabelsEmpty();
    const sheet = useTableSheet();
    const rowTypes = useTableRowTypes();
    const [sheetIndex] = useTableSheetIndex();

    if (empty || !sheet || !rowTypes) return null;

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
                        key={sheetIndex + '_' + index}
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
        <th className={'border-r border-b mc-border p-1 w-16 text-xs font-normal table-th-color'}>
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
