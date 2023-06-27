import { v4 as uuidv4 } from 'uuid';

import { EditorModel } from '@utils/models/EditorModel';
import { HierarchyNode } from '@utils/types';

import { GroupNode } from './nodeGroup';

export type SelectionType = Map<EditorModel, Set<number>>;

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

    abstract exportNode(): HierarchyNode;

    getValue(keyChain: string[]) {
        let i = 0;
        let data = this.data;
        while (i < keyChain.length) {
            if (data === undefined) return undefined;
            data = data[keyChain[i]];
            i++;
        }
        return data;
    }
}
