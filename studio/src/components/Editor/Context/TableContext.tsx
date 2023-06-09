import React from 'react';

import { GroupNode, ModelGraph, Node, Tables } from '@utils/utils';

interface TablesContextProps {
    graph: ModelGraph;
    setGraph: React.Dispatch<React.SetStateAction<ModelGraph>>;
    nodeToMove: Node | undefined;
    setNodeToMove: React.Dispatch<React.SetStateAction<Node | undefined>>;
    nodeToLink: Node | undefined;
    setNodeToLink: React.Dispatch<React.SetStateAction<Node | undefined>>;
    tables: Tables;
    setTables: React.Dispatch<React.SetStateAction<Tables>>;
    activeSheet: number;
    setActiveSheet: React.Dispatch<React.SetStateAction<number>>;
}

const context = React.createContext<TablesContextProps>({} as TablesContextProps);

export function TablesContext(props: { children: React.ReactNode }) {
    const [graph, setGraph] = React.useState<ModelGraph>(new ModelGraph());
    const [nodeToMove, setNodeToMove] = React.useState<Node | undefined>();
    const [nodeToLink, setNodeToLink] = React.useState<Node | undefined>();
    const [tables, setTables] = React.useState<Tables>(new Tables([]));
    const [activeSheet, setActiveSheet] = React.useState<number>(0);

    React.useEffect(() => {
        graph.addChangeListener(() => {
            const updated = new ModelGraph();
            updated.copy(graph);
            setGraph(updated);
        });
    }, [graph]);

    return (
        <context.Provider
            value={{
                graph,
                setGraph,
                nodeToMove,
                setNodeToMove,
                nodeToLink,
                setNodeToLink,
                tables,
                setTables,
                activeSheet,
                setActiveSheet,
            }}
        >
            {props.children}
        </context.Provider>
    );
}

export function useTablesContext(): TablesContextProps {
    return React.useContext(context);
}

export function useGraph(): [ModelGraph, React.Dispatch<React.SetStateAction<ModelGraph>>] {
    const ctx = React.useContext(context);
    return [ctx.graph, ctx.setGraph];
}

export function useMovingNode(): [Node | undefined, (node: Node | undefined) => void] {
    const ctx = React.useContext(context);

    const updateNodeToMove = (node: Node | undefined) => {
        ctx.setNodeToMove((prev) => {
            if (prev === node) return undefined;
            if (prev === undefined) return node;
            if (node === undefined) return undefined;
            else {
                if (node instanceof GroupNode) {
                    if (node.isDescendantOf(prev)) return undefined;
                    ctx.graph.moveNode(prev, node);
                    return undefined;
                } else {
                    //fallback
                    return node;
                }
            }
        });
    };

    return [ctx.nodeToMove, updateNodeToMove];
}

export function useLinkingNode(): [Node | undefined, (node: Node | undefined) => void] {
    const ctx = React.useContext(context);

    const updateNodeToLink = (node: Node | undefined) => {
        ctx.setNodeToLink((prev) => {
            if (prev === node || node === undefined) {
                return undefined;
            } else {
                return node;
            }
        });
    };

    return [ctx.nodeToLink, updateNodeToLink];
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
