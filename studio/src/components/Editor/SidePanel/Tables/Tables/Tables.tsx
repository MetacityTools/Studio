import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';

import { useActiveSheet, useSheets, useTables } from '@editor/Context/TableContext';
import { Sheet } from '@editor/SidePanel/Tables/Tables/Sheet';

import { Empty } from '@elements/Empty';
import { colorActive, colorBase } from '@elements/colors';

export function Tables() {
    const [tables] = useTables();

    if (tables.empty) {
        return <Empty>No tables</Empty>;
    }

    return (
        <>
            <div className="h-full flex-1 relative">
                <div className="absolute w-full h-full overflow-auto">
                    <div className="h-[1200px]">
                        <Sheet />
                    </div>
                </div>
            </div>
            <TablesSheetList />
        </>
    );
}

function TablesSheetList() {
    const [tables] = useTables();
    const [addSheet, removeSheet] = useSheets();
    const [activeSheet, updateActiveSheet] = useActiveSheet();

    const handleRemoveSheet = (index: number) => {
        removeSheet(index);
        if (index === activeSheet) {
            updateActiveSheet(0);
        }
    };

    return (
        <div className="flex flex-row overflow-y-auto border-t">
            {tables.sheets.map((_, index) => (
                <div
                    className={clsx(
                        'border-r flex flex-row items-center',
                        activeSheet === index ? colorActive : colorBase
                    )}
                    key={index}
                >
                    <button
                        key={index}
                        className={clsx(
                            'px-2 py-1',
                            activeSheet === index ? colorActive : colorBase
                        )}
                        onClick={() => updateActiveSheet(index)}
                    >
                        Sheet {index}
                    </button>
                    <button className="px-2 h-full" onClick={() => handleRemoveSheet(index)}>
                        <IoClose />
                    </button>
                </div>
            ))}
        </div>
    );
}
