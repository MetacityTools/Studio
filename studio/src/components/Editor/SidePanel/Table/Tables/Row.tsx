import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { VscSymbolInterface } from 'react-icons/vsc';

import { useLinkingNode, useTables, useUpdateTables } from '@editor/Context/TableContext';

import { TableCell } from './Cell';

interface TableRowProps {
    index: number;
    row: string[];
}

const cellCls = 'border-r border-b whitespace-pre px-2 h-full';

export function TableRow(props: TableRowProps) {
    const { index, row } = props;
    const [, activeSheet, activeRows] = useTables();
    const [nodeToLink] = useLinkingNode();
    const [, updateActiveRows] = useUpdateTables();
    const selected = activeRows.has(index);

    return (
        <tr className={clsx(selected ? 'bg-amber-100' : 'odd:bg-neutral-50', 'transition-colors')}>
            <td
                className={clsx(
                    cellCls,
                    'text-xs sticky left-0 cursor-pointer transition-all hover:text-amber-900 hover:bg-amber-300',
                    selected ? 'text-amber-800 bg-amber-300' : 'text-neutral-500 bg-neutral-100'
                )}
                onClick={() => updateActiveRows(index)}
            >
                <div className="flex flex-row items-center">
                    <Transition
                        show={!!(selected && nodeToLink)}
                        enter="transition-all duration-150"
                        enterFrom="opacity-0 w-0"
                        enterTo="opacity-100 w-6"
                        leave="transition-all duration-150"
                        leaveFrom="opacity-100 w-6"
                        leaveTo="opacity-0 w-0"
                    >
                        <VscSymbolInterface className="rotate-180 mr-2" />
                    </Transition>
                    <div>{String(index + 1).padStart(4, '0')}</div>
                </div>
            </td>
            {row.map((cell, cindex) => (
                <TableCell
                    key={activeSheet + '_' + index + '_' + cindex}
                    col={cindex}
                    contents={cell}
                    row={index}
                    className={cellCls}
                />
            ))}
        </tr>
    );
}
