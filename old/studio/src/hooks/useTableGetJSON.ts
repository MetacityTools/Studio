import React from 'react';

import { context } from '@context/TablesContext';

export function useTableGetJSON(): (row: number) => { [key: string]: any } {
    const ctx = React.useContext(context);

    const getJSON = (rowIdx: number) => {
        const sheet = ctx.sheets[ctx.activeSheet];
        const rowData = sheet[rowIdx];

        const result: any = {};
        for (let i = 0; i < rowData.length; i++) {
            const value = rowData[i];

            if (value === '') continue;
            const keys = getKeysForColumn(ctx.activeSheet, i, sheet, ctx.rowTypes);
            if (keys.length === 0) return {};
            recursiveInsert(keys, value, result);
        }
        return result;
    };

    return getJSON;
}

function getKeysForColumn(sheet: number, column: number, table: string[][], rowTypes: string[][]) {
    const keys: string[] = [];

    let k: string;
    for (let i = 0; i < table.length; i++) {
        if (rowTypes[sheet][i] === 'key') {
            k = cleanString(table[i][column]);
            if (k !== '') keys.push(k);
        }
    }

    return keys;
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
