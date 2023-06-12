import { v4 as uuidv4 } from 'uuid';

import { SelectionType } from '@utils/components/Context';

import { GroupNode } from './nodeGroup';

export abstract class Node {
    parent?: GroupNode;
    data: { [key: string]: any } = {};
    uuid = uuidv4();

    addParent(parent: GroupNode) {
        this.parent = parent;
    }

    abstract selected(selectedModels: SelectionType): boolean;

    setData(data: { [key: string]: any }) {
        this.data = data;
    }
}
