import { combineData } from '@utils/metadata';

import { useSelected } from './useSelected';

export function useMetadataSelected() {
    const selected = useSelected();
    const { common } = combineData(selected);
    return common;
}
