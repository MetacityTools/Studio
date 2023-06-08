import clsx from 'clsx';
import React from 'react';

import { useTables, useUpdateTables } from '@editor/Context/TableContext';
import { Sheet } from '@editor/SidePanel/Table/Tables/Sheet';

import { EmptyTable } from '@elements/Empty';
import { If } from '@elements/If';

import { MetaMenu } from '../Menu/MetaMenu';

export function Tables() {
    const [tables, activeSheet] = useTables();
    const [, , updateActiveSheet] = useUpdateTables();

    return (
        <div className="flex flex-col w-full h-full">
            <MetaMenu />
            <If cond={tables.empty}>
                <EmptyTable />
            </If>
            <If cond={!tables.empty}>
                <div className="w-full h-full overflow-scroll">
                    <Sheet />
                </div>
                <div className="flex flex-row overflow-y-auto border-t">
                    {tables.sheets.map((_, index) => (
                        <button
                            key={index}
                            className={clsx(
                                'px-4 border-r hover:bg-amber-400 hover:text-amber-900 transition-colors',
                                activeSheet === index && 'text-amber-800 bg-amber-300'
                            )}
                            onClick={() => updateActiveSheet(index)}
                        >
                            Sheet {index}
                        </button>
                    ))}
                </div>
            </If>
        </div>
    );
}
