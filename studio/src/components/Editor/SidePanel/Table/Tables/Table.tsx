import React from 'react';

import { TablesContext } from '@editor/Context/TableContext';

import { EmptyTable } from '@elements/Empty';
import { Table } from '@elements/Table';

export function Tables() {
    const { tables, setTables } = React.useContext(TablesContext);
    const [selectedTable, setSelectedTable] = React.useState<number>(0);

    if (tables.length == 0) return <EmptyTable />;

    return (
        <div className="flex flex-col w-full h-full">
            <div className="w-full h-full overflow-scroll">
                <Table
                    table={tables[selectedTable]}
                    updateValue={(row, col, value) => {
                        const newTables = [...tables];
                        newTables[selectedTable][row][col] = value;
                        setTables(newTables);
                    }}
                />
            </div>
            <div className="flex flex-row overflow-y-auto border-t">
                {tables.map((table, index) => (
                    <div key={index} className="px-4" onClick={() => setSelectedTable(index)}>
                        table
                    </div>
                ))}
            </div>
        </div>
    );
}
