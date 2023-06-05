import { v4 as uuidv4 } from 'uuid';

import { GroupNode } from './nodeGroup';

export abstract class Node {
    parent?: GroupNode;
    uuid = uuidv4();

    addParent(parent: GroupNode) {
        this.parent = parent;
    }

    abstract selected(selectedModels: Set<number>): boolean;
}
