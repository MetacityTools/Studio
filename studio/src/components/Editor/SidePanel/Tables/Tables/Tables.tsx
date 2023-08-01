import React from 'react';

import { useTables } from '@editor/EditorContext';
import { Sheet } from '@editor/SidePanel/Tables/Tables/Sheet';

import { Empty } from '@elements/Empty';
import { useLogger } from '@elements/GlobalContext';

import { useMetadata, useSelectedModels } from '@shared/Context/hooks';
import { assignDataNoDelete } from '@shared/Context/metadata';

export function Tables() {
    const [tables] = useTables();
    const selected = useSelectedModels();
    const [_, updateGlobalMetadata] = useMetadata();
    const logger = useLogger();

    const handleAssignToGeometry = React.useCallback(
        (data: any) => {
            if (Object.keys(data).length === 0) {
                logger('No data to assign, check is there are any rows with type "key" assigned');
                return;
            }

            assignDataNoDelete(selected, data);
            updateGlobalMetadata();
            logger(`Assigned data to ${selected.size} models`);
        },
        [selected]
    );

    if (tables.empty) return <Empty>No tables</Empty>;
    return <Sheet assignToGeometry={handleAssignToGeometry} />;
}
