import { v4 as uuidv4 } from 'uuid';

import { GroupNode } from './nodeGroup';

export abstract class Node {
    parent?: GroupNode;
    records: Map<number, Set<number>> = new Map();
    uuid = uuidv4();

    addParent(parent: GroupNode) {
        this.parent = parent;
    }

    abstract selected(selectedModels: Set<number>): boolean;

    linkTableRecords(sheet: number, row: number) {
        let records = this.records.get(sheet);
        if (!records) {
            records = new Set();
            this.records.set(sheet, records);
        }

        if (!records.has(row)) records.add(row);
        else records.delete(row);
    }

    getLinkedTableRecords(sheet: number) {
        return this.records.get(sheet) || new Set();
    }
}
