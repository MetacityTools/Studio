import { Empty } from '@elements/Empty';

import { useStyle } from '@hooks/useStyle';
import { useStyleKeychain } from '@hooks/useStyleKeychain';

import { StyleCategoryList } from './StyleCategoryList';
import { StyleScalars } from './StyleScalars';

export function StyleDetail() {
    const [histogram, style] = useStyle();
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
