import React from 'react';

import { Tables } from '@utils/utils';

interface EditorContextProps {
    tables: Tables;
    setTables: React.Dispatch<React.SetStateAction<Tables>>;
    activeSheet: number;
    setActiveSheet: React.Dispatch<React.SetStateAction<number>>;
    status: 'editing' | 'saved' | 'failed' | undefined;
    setStatus: React.Dispatch<React.SetStateAction<'editing' | 'saved' | 'failed' | undefined>>;
}

const context = React.createContext<EditorContextProps>({} as EditorContextProps);

export function EditorContext(props: { children: React.ReactNode }) {
    const [tables, setTables] = React.useState<Tables>(new Tables([]));
    const [activeSheet, setActiveSheet] = React.useState<number>(0);
    const [status, setStatus] = React.useState<'editing' | 'saved' | 'failed' | undefined>();

    return (
        <context.Provider
            value={{
                tables,
                setTables,
                activeSheet,
                setActiveSheet,
                status,
                setStatus,
            }}
        >
            {props.children}
        </context.Provider>
    );
}

export function useTablesContext(): EditorContextProps {
    return React.useContext(context);
}

export function useTables(): [Tables, React.Dispatch<React.SetStateAction<Tables>>] {
    const ctx = React.useContext(context);
    return [ctx.tables, ctx.setTables];
}

export function useSheets(): [(content: string) => void, (index: number) => void] {
    const ctx = React.useContext(context);
    const addSheet = (content: string) => {
        ctx.setTables(ctx.tables.addSheet(content));
    };

    const removeSheet = (index: number) => {
        ctx.setTables(ctx.tables.removeSheet(index));
    };

    return [addSheet, removeSheet];
}

export function useActiveSheet(): [number, React.Dispatch<React.SetStateAction<number>>] {
    const ctx = React.useContext(context);
    return [ctx.activeSheet, ctx.setActiveSheet];
}

export function useRowTypes(): (sheet: number, row: number, rowType: string) => void {
    const ctx = React.useContext(context);
    return (sheet: number, row: number, rowType: string) => {
        ctx.setTables(ctx.tables.setSheetRowType(sheet, row, rowType as any));
    };
}

export function useStatus(): [
    'editing' | 'saved' | 'failed' | undefined,
    React.Dispatch<React.SetStateAction<'editing' | 'saved' | 'failed' | undefined>>
] {
    const ctx = React.useContext(context);
    return [ctx.status, ctx.setStatus];
}
