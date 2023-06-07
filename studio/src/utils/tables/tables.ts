import { parse } from '@vojtatom/csvts';

export class Tables {
    constructor(public contents: string[][][]) {}

    addSheet(contents: string) {
        const parsed = parse(contents);
        const tableCopy = [...this.contents];
        tableCopy.push(parsed);
        return new Tables(tableCopy);
    }

    getSheet(table: number) {
        return this.contents[table];
    }

    get empty() {
        return this.contents.length === 0;
    }

    get sheets() {
        return this.contents;
    }
}
