import { parse } from '@vojtatom/csvts';

export class Tables {
    constructor(public contents: string[][][]) {}

    changeCell(sheet: number, row: number, col: number, value: string) {
        const tableCopy = [...this.contents];
        const rowCopy = [...tableCopy[sheet]];
        const colCopy = [...rowCopy[row]];
        colCopy[col] = value;
        rowCopy[row] = colCopy;
        tableCopy[sheet] = rowCopy;
        return new Tables(tableCopy);
    }

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
