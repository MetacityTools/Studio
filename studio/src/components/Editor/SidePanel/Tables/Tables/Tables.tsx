import React from 'react';

import { useTables } from '@editor/EditorContext';
import { Sheet } from '@editor/SidePanel/Tables/Tables/Sheet';

import { Empty } from '@elements/Empty';

import { useMetadata, useSelectedModels } from '@shared/Context/hooks';
import { assignDataNoDelete } from '@shared/Context/metadata';

export function Tables() {
    const [tables] = useTables();
    const selected = useSelectedModels();
    const [_, updateGlobalMetadata] = useMetadata();

    const handleAssignToGeometry = React.useCallback(
        (data: any) => {
            assignDataNoDelete(selected, data);
            updateGlobalMetadata();
        },
        [selected]
    );

    if (tables.empty) return <Empty>No tables</Empty>;
    return <Sheet assignToGeometry={handleAssignToGeometry} />;
}
