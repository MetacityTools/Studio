import clsx from 'clsx';

import { TableCell } from './TableCell';

export function TableRow(props: {
    indexRow: number;
    row: string[];
    selected: boolean;
    onSelect: () => void;
    onUpdateValue: (row: number, col: number, value: string) => void;
}) {
    const { indexRow, row, selected, onSelect, onUpdateValue } = props;

    const cellCls = 'border-r border-b whitespace-pre px-2 h-full';

    return (
        <tr
            key={indexRow}
            className={clsx(selected ? 'even:bg-amber-50 odd:bg-amber-100' : 'odd:bg-neutral-50')}
        >
            <td
                className={clsx(
                    cellCls,
                    'text-xs sticky left-0 cursor-pointer transition-colors hover:text-amber-900 hover:bg-amber-300',
                    selected ? 'text-amber-800 bg-amber-300' : 'text-neutral-500 bg-neutral-100'
                )}
                onClick={onSelect}
            >
                {indexRow + 1}
            </td>
            {row.map((cell, index) => (
                <TableCell
                    key={index}
                    value={cell}
                    className={cellCls}
                    onChange={(value) => {
                        onUpdateValue(indexRow, index, value);
                    }}
                />
            ))}
        </tr>
    );
}
