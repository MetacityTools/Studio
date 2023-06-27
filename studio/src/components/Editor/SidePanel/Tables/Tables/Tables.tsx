import { useTables } from '@editor/EditorContext';
import { Sheet } from '@editor/SidePanel/Tables/Tables/Sheet';

import { Empty } from '@elements/Empty';

export function Tables() {
    const [tables] = useTables();
    if (tables.empty) return <Empty>No tables</Empty>;
    return <Sheet />;
}
