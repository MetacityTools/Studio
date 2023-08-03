import React from 'react';

export type rowType = 'key' | 'value';

interface TablesContextProps {
    sheets: string[][][];
    setSheets: React.Dispatch<React.SetStateAction<string[][][]>>;
    rowTypes: rowType[][];
    setRowTypes: React.Dispatch<React.SetStateAction<rowType[][]>>;
    activeSheet: number;
    setActiveSheet: React.Dispatch<React.SetStateAction<number>>;
}

export const context = React.createContext<TablesContextProps>({} as TablesContextProps);

export function TablesContext(props: { children: React.ReactNode }) {
    const [sheets, setSheets] = React.useState<string[][][]>([]);
    const [rowTypes, setRowTypes] = React.useState<rowType[][]>([]);
    const [activeSheet, setActiveSheet] = React.useState<number>(0);

    return (
        <context.Provider
            value={{
                sheets,
                setSheets,
                rowTypes,
                setRowTypes,
                activeSheet,
                setActiveSheet,
            }}
        >
            {props.children}
        </context.Provider>
    );
}
