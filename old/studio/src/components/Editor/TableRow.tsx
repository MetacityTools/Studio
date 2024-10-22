import clsx from 'clsx';
import { BiLink } from 'react-icons/bi';

import { rowType } from '@context/TablesContext';

import { useTableGetJSON } from '@hooks/useTableGetJSON';
import { useTableSetRowType } from '@hooks/useTableSetRowType';
import { useTableSheetIndex } from '@hooks/useTableSheetIndex';

export type AssignToGeometryCallback = (data: any) => void;

interface TableRowProps {
    index: number;
    row: string[];
    rowType: string;
    assignToGeometry: AssignToGeometryCallback;
}

function ActionButton(props: { children: React.ReactNode; onClick?: () => void; title?: string }) {
    return (
        <button
            className="hover:text-amber-500 active:text-amber-600 cursor-pointer"
            onClick={props.onClick}
            title={props.title}
        >
            {props.children}
        </button>
    );
}

export function TableRow(props: TableRowProps) {
    const { index, row, rowType } = props;
    const getJSON = useTableGetJSON();
    const updateRowType = useTableSetRowType();
    const [activeSheet] = useTableSheetIndex();

    const handleRowTypeUpdate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        updateRowType(index, value as rowType);
    };

    const handleLinkToSelection = () => {
        const json = getJSON(index);
        props.assignToGeometry(json);
    };

    return (
        <tr className="table-tr-color">
            <td className="table-td-action-color border-r border-b  mc-border sticky left-0">
                <div className="w-full h-full flex flex-row text-xl space-x-2 px-1">
                    <ActionButton
                        title="Assign to selected geometry"
                        onClick={handleLinkToSelection}
                    >
                        <BiLink className="inline-block ml-1" />
                    </ActionButton>
                </div>
            </td>
            <Td className="table-td-action-color">
                <select
                    name="rowType"
                    id="rowType"
                    defaultValue={rowType}
                    onChange={handleRowTypeUpdate}
                    className="text-neutral-500 bg-transparent outline-none cursor-pointer"
                >
                    <option value="key">key</option>
                    <option value="value">value</option>
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
        <td
            className={clsx(
                'border-r border-b mc-border whitespace-pre px-2 h-full',
                props.className
            )}
        >
            {props.children}
        </td>
    );
}
