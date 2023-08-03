import { useActiveSheet, useSheets, useTables } from '@context/TablesContext';
import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';

import { RowContainer } from '@elements/Containers';

export function TablesSheetList() {
    const [tables] = useTables();
    const [addSheet, removeSheet] = useSheets();
    const [activeSheet, updateActiveSheet] = useActiveSheet();

    const handleRemoveSheet = (index: number) => {
        removeSheet(index);
        if (index === activeSheet) {
            updateActiveSheet(0);
        }
    };

    if (tables.empty) return null;

    return (
        <RowContainer className="overflow-y-auto border-t mc-border">
            {tables.sheets.map((_, index) => (
                <RowContainer
                    className={clsx('border-r', activeSheet === index ? 'active' : 'base')}
                    key={index}
                >
                    <button
                        key={index}
                        className={clsx('px-2', activeSheet === index ? 'active' : 'base')}
                        onClick={() => updateActiveSheet(index)}
                    >
                        Sheet {index}
                    </button>
                    <button className="px-2 h-full" onClick={() => handleRemoveSheet(index)}>
                        <IoClose />
                    </button>
                </RowContainer>
            ))}
        </RowContainer>
    );
}
