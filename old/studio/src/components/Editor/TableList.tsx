import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';

import { RowContainer } from '@elements/Containers';

import { useTabelsEmpty } from '@hooks/useTabeIsEmpty';
import { useTableRemoveSheet } from '@hooks/useTableRemoveSheet';
import { useTableSheetCount } from '@hooks/useTableSheetCount';
import { useTableSheetIndex } from '@hooks/useTableSheetIndex';

export function TablesSheetList() {
    const removeSheet = useTableRemoveSheet();
    const [sheetIndex, setSheetIndex] = useTableSheetIndex();
    const empty = useTabelsEmpty();
    const sheetCount = useTableSheetCount();

    const handleRemoveSheet = (index: number) => {
        removeSheet(index);
        if (index === sheetIndex) {
            setSheetIndex(0);
        }
    };

    if (empty) return null;

    return (
        <RowContainer className="overflow-y-auto border-t mc-border">
            {Array(sheetCount).map((_, index) => (
                <RowContainer
                    className={clsx('border-r', sheetIndex === index ? 'active' : 'base')}
                    key={index}
                >
                    <button
                        key={index}
                        className={clsx('px-2', sheetIndex === index ? 'active' : 'base')}
                        onClick={() => setSheetIndex(index)}
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
