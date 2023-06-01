import clsx from 'clsx';

import { Cell, cellCls } from './Cell';

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
    updateValue: (row: number, col: number, value: string) => void;
}) {
    const { table, updateValue } = props;
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
                    <tr key={indexRow} className="odd:bg-neutral-50">
                        <td
                            className={clsx(
                                cellCls,
                                'text-xs sticky left-0 text-neutral-500 bg-neutral-100'
                            )}
                        >
                            {indexRow + 1}
                        </td>
                        {row.map((cell, index) => (
                            <Cell
                                key={index}
                                value={cell}
                                onChange={(value) => {
                                    updateValue(indexRow, index, value);
                                    console.log('updateValue', indexRow, index, value);
                                }}
                            />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
