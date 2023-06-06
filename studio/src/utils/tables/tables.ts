import { parse } from '@vojtatom/csvts';

export class Tables {
    constructor(public contents: string[][][]) {}

    changeCell(sheet: number, row: number, col: number, value: string) {
        const sheetsCopy = [...this.contents];
        const sheetCopy = [...sheetsCopy[sheet]];
        const rowCopy = [...sheetCopy[row]];
        rowCopy[col] = value;
        sheetCopy[row] = rowCopy;
        sheetsCopy[sheet] = sheetCopy;
        return new Tables(sheetsCopy);
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
