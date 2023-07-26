import { parse } from 'tablests';

type rowType = 'key' | 'value';

export class Tables {
    public rowTypes: rowType[][] = [];

    constructor(public contents: string[][][], rowTypes?: rowType[][]) {
        if (!rowTypes) {
            for (const sheet of contents) {
                this.rowTypes.push(sheet.map(() => 'value'));
            }
        } else {
            this.rowTypes = rowTypes;
        }
    }

    addSheet(contents: string) {
        const parsed = parse(contents);
        const tableCopy = [...this.contents];
        tableCopy.push(parsed);
        const rowTypesCopy = [...this.rowTypes];
        rowTypesCopy.push(parsed.map(() => 'value'));
        return new Tables(tableCopy, rowTypesCopy);
    }

    removeSheet(index: number) {
        const tableCopy = [...this.contents];
        tableCopy.splice(index, 1);
        const rowTypesCopy = [...this.rowTypes];
        rowTypesCopy.splice(index, 1);
        return new Tables(tableCopy, rowTypesCopy);
    }

    getSheet(table: number) {
        return this.contents[table];
    }

    setSheetRowType(sheet: number, row: number, rowType: rowType) {
        const tableCopy = [...this.rowTypes];
        const sheetCopy = [...tableCopy[sheet]];
        sheetCopy[row] = rowType;
        tableCopy[sheet] = sheetCopy;
        return new Tables(this.contents, tableCopy);
    }

    getSheetRowTypes(sheet: number) {
        return this.rowTypes[sheet];
    }

    getJSON(sheet: number, row: number): { [key: string]: any } {
        const table = this.contents[sheet];
        const rowData = table[row];

        const result: any = {};
        for (let i = 0; i < rowData.length; i++) {
            const value = rowData[i];
            if (value === '') continue;
            const keys = this.getKeysForColumn(sheet, i);
            if (keys.length === 0) return {};
            recursiveInsert(keys, value, result);
        }
        return result;
    }

    private getKeysForColumn(sheet: number, column: number) {
        const keys: string[] = [];
        const table = this.contents[sheet];

        let k: string;
        for (let i = 0; i < table.length; i++) {
            if (this.rowTypes[sheet][i] === 'key') {
                k = cleanString(table[i][column]);
                if (k !== '') keys.push(k);
            }
        }

        return keys;
    }

    get empty() {
        return this.contents.length === 0;
    }

    get sheets() {
        return this.contents;
    }
}

function recursiveInsert(keys: string[], value: any, obj: any) {
    if (keys.length === 0) {
        const num = parseFloat(value);

        if (isNaN(num)) {
            return cleanString(String(value));
        } else {
            return num;
        }
    }

    const key = cleanString(keys.shift()!);
    obj[key] = recursiveInsert(keys, value, obj[key] ?? {});
    return obj;
}

function cleanString(str: string) {
    return str
        .replaceAll('\n', ' ')
        .replaceAll('\r', ' ')
        .replaceAll('\t', ' ')
        .trim()
        .replace(/ +(?= )/g, '');
}
