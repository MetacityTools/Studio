import { useStyleInfo, useStyleKeychain } from '@hooks/hooks';

import { Empty } from '@elements/Empty';

import { StyleCategoryList } from './StyleCategory/StyleCategoryList';
import { StyleScalars } from './StyleScalars/StyleScalars';

export function StyleInfo() {
    const [histogram, style] = useStyleInfo();
    const keychain = useStyleKeychain();

    if (!style || !keychain) return <Empty>No Style Info</Empty>;

    return (
        <div className="py-2">
            {style.style?.scalars && histogram && (
                <StyleScalars scalars={style.style.scalars} histogram={histogram} />
            )}
            {style.style?.categories && <StyleCategoryList categories={style.style.categories} />}
        </div>
    );
}
