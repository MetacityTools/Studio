import clsx from 'clsx';
import { BiCopy } from 'react-icons/bi';

import { useActiveSheet, useRowTypes, useTables } from '@editor/Context/TableContext';

interface TableRowProps {
    index: number;
    row: string[];
    rowType: string;
}

const cellCls = 'border-r border-b whitespace-pre px-2 h-full';

export function TableRow(props: TableRowProps) {
    const { index, row, rowType } = props;
    const [activeSheet] = useActiveSheet();
    const [tables] = useTables();

    const updateRowType = useRowTypes();

    const handleRowTypeUpdate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        updateRowType(activeSheet, index, value);
    };

    const handleCopyClipboard = () => {
        console.log('copy to clipboard');
        const json = tables.getJSON(activeSheet, index);
        console.log(json);
        navigator.clipboard.writeText(JSON.stringify(json, null, 4));
    };

    return (
        <tr className="odd:bg-neutral-50">
            <td
                className="text-neutral-500 px-2 bg-neutral-100 border-r border-b sticky left-0 cursor-pointer hover:bg-amber-200 hover:text-amber-800"
                onClick={handleCopyClipboard}
                title="Copy row to clipboard"
            >
                <div className="flex flex-row items-center">
                    {String(index + 1).padStart(4, '0')}
                    <BiCopy className="inline-block ml-1" />
                </div>
            </td>
            <td className={clsx(cellCls, 'text-neutral-500 bg-neutral-100')}>
                <select
                    name="rowType"
                    id="rowType"
                    defaultValue={rowType}
                    onChange={handleRowTypeUpdate}
                    className="text-neutral-500 bg-transparent outline-none cursor-pointer"
                >
                    <option value="key">key</option>
                    <option value="value">value</option>
                    <option value="value">units</option>
                </select>
            </td>
            {row.map((cell, cindex) => (
                <td className={cellCls} key={activeSheet + '_' + index + '_' + cindex}>
                    {cell}
                </td>
            ))}
        </tr>
    );
}