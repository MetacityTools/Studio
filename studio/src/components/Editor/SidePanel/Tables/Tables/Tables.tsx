import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';

import { useActiveSheet, useSheets, useTables } from '@editor/Context/TableContext';
import { Sheet } from '@editor/SidePanel/Tables/Tables/Sheet';

import { Empty } from '@elements/Empty';

export function Tables() {
    const [tables] = useTables();
    const [addSheet, removeSheet] = useSheets();
    const [activeSheet, updateActiveSheet] = useActiveSheet();

    const handleRemoveSheet = (index: number) => {
        removeSheet(index);
        if (index === activeSheet) {
            updateActiveSheet(0);
        }
    };

    if (tables.empty) {
        return <Empty>No tables</Empty>;
    }

    return (
        <div className="border-blue-500 border-4 overflow-auto">
            <Sheet />
        </div>
    );
}

/*
<div className="w-full overflow-auto">
                <Sheet />
            </div>
<div className="flex flex-row overflow-y-auto border-t">
                {tables.sheets.map((_, index) => (
                    <div
                        className={clsx(
                            'border-r flex flex-row items-center hover:bg-amber-200 hover:text-amber-800',
                            activeSheet === index && 'text-amber-800 bg-amber-200'
                        )}
                        key={index}
                    >
                        <button
                            key={index}
                            className={clsx('px-2 py-2 transition-colors')}
                            onClick={() => updateActiveSheet(index)}
                        >
                            Sheet {index}
                        </button>
                        <button
                            className="px-2 hover:bg-amber-400 hover:text-amber-900 transition-colors h-full"
                            onClick={() => handleRemoveSheet(index)}
                        >
                            <IoClose />
                        </button>
                    </div>
                ))}
            </div>

            */
