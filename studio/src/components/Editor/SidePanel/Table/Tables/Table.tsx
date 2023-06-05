import clsx from 'clsx';
import React from 'react';

import { TablesContext } from '@editor/Context/TableContext';

import { EmptyTable } from '@elements/Empty';
import { Table } from '@elements/Table';

import { TableMenu } from '../Menu/TableMenu';

export function Tables() {
    const { tables, activeSheet, updateCell, toggleRowSelection, activeRows, setActiveSheet } =
        React.useContext(TablesContext);

    return (
        <div className="flex flex-col w-full h-full">
            <TableMenu />
            {tables.empty ? (
                <EmptyTable />
            ) : (
                <>
                    <div className="w-full h-full overflow-scroll">
                        <Table
                            table={tables.getSheet(activeSheet)}
                            onUpdateValue={(row, col, value) => {
                                updateCell(activeSheet, row, col, value);
                            }}
                            onSelectRow={(row) => {
                                toggleRowSelection(row);
                            }}
                            selectedRows={activeRows}
                        />
                    </div>
                    <div className="flex flex-row overflow-y-auto">
                        {tables.sheets.map((table, index) => (
                            <button
                                key={index}
                                className={clsx(
                                    'px-4 border-r hover:bg-amber-400 hover:text-amber-900 transition-colors',
                                    activeSheet === index && 'text-amber-800 bg-amber-300'
                                )}
                                onClick={() => setActiveSheet(index)}
                            >
                                Sheet {index}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
