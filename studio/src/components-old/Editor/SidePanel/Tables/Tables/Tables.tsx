import { useTables } from '@context/TablesContext';
import { useMetadata, useSelectedModels } from '@hooks/hooks';
import { assignDataNoDelete } from '@hooks/metadata';
import { Sheet } from 'components-old/Editor/SidePanel/Tables/Tables/Sheet';
import React from 'react';

import { Empty } from '@elements/Empty';
import { useLogger } from '@elements/GlobalContext';

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
