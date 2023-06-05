import React from 'react';

import { ModelGraph, Node, Tables } from '@utils/utils';

interface TablesContextProps {
    graph: ModelGraph;
    setGraph: React.Dispatch<React.SetStateAction<ModelGraph>>;
    nodeToMove: Node | undefined;
    setNodeToMove: React.Dispatch<React.SetStateAction<Node | undefined>>;
    tables: Tables;
    activeSheet: number;
    activeRows: Set<number>;
    addSheet: (content: string) => void;
    setActiveSheet: React.Dispatch<React.SetStateAction<number>>;
    toggleRowSelection: (row: number) => void;
    updateCell: (table: number, row: number, col: number, value: string) => void;
}

export const TablesContext = React.createContext<TablesContextProps>({} as TablesContextProps);

export function TablesContextComponent(props: { children: React.ReactNode }) {
    const [graph, setGraph] = React.useState<ModelGraph>(new ModelGraph());
    const [nodeToMove, setNodeToMove] = React.useState<Node | undefined>();
    const [tables, setTables] = React.useState<Tables>(new Tables([]));
    const [activeSheet, setActiveSheet] = React.useState<number>(0);
    const [activeRows, setActiveRows] = React.useState<Set<number>>(new Set<number>());

    React.useEffect(() => {
        graph.addChangeListener(() => {
            const updated = new ModelGraph();
            updated.copy(graph);
            setGraph(updated);
        });
    }, [graph]);

    const updateCell = (table: number, row: number, col: number, value: string) => {
        setTables(tables.changeCell(table, row, col, value));
    };

    const addSheet = (content: string) => {
        setTables(tables.addSheet(content));
    };

    const toggleRowSelection = (row: number) => {
        const updated = new Set(activeRows);
        if (updated.has(row)) {
            updated.delete(row);
        } else {
            updated.add(row);
        }
        setActiveRows(updated);
    };

    React.useEffect(() => {
        setActiveRows(new Set<number>());
    }, [activeSheet]);

    return (
        <TablesContext.Provider
            value={{
                graph,
                setGraph,
                nodeToMove,
                setNodeToMove,
                tables,
                activeSheet,
                activeRows,
                updateCell,
                addSheet,
                setActiveSheet,
                toggleRowSelection,
            }}
        >
            {props.children}
        </TablesContext.Provider>
    );
}
