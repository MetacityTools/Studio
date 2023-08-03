import React from 'react';

import { assignDataNoDelete } from '@utils/metadata';

import { Empty } from '@elements/Empty';

import { useLogger } from '@hooks/useLogger';
import { useUpdateMetadata } from '@hooks/useMetadataUpdate';
import { useSelected } from '@hooks/useSelected';
import { useTabelsEmpty } from '@hooks/useTabeIsEmpty';

import { Sheet } from './TableSheet';

export function Tables() {
    const selected = useSelected();
    const updateMetadata = useUpdateMetadata();
    const logger = useLogger();
    const empty = useTabelsEmpty();

    const handleAssignToGeometry = React.useCallback(
        (data: any) => {
            if (Object.keys(data).length === 0) {
                logger('No data to assign, check is there are any rows with type "key" assigned');
                return;
            }

            assignDataNoDelete(selected, data);
            updateMetadata();
            logger(`Assigned data to ${selected.size} models`);
        },
        [selected]
    );

    if (empty) return <Empty>No tables</Empty>;
    return <Sheet assignToGeometry={handleAssignToGeometry} />;
}
