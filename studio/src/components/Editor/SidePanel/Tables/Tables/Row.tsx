import clsx from 'clsx';
import { BiCopy } from 'react-icons/bi';

import { useActiveSheet, useRowTypes, useTables } from '@editor/EditorContext';

interface TableRowProps {
    index: number;
    row: string[];
    rowType: string;
}

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
        const json = tables.getJSON(activeSheet, index);
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
            <Td className="text-neutral-500 bg-neutral-100">
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
            </Td>
            {row.map((cell, cindex) => (
                <Td key={activeSheet + '_' + index + '_' + cindex}>{cell}</Td>
            ))}
        </tr>
    );
}

export function Td(props: { children: React.ReactNode; className?: string }) {
    return (
        <td className={clsx('border-r border-b whitespace-pre px-2 h-full', props.className)}>
            {props.children}
        </td>
    );
}
