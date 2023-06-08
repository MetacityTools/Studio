import React from 'react';

import { GroupNode, ModelGraph, Node, Tables } from '@utils/utils';

interface TablesContextProps {
    graph: ModelGraph;
    setGraph: React.Dispatch<React.SetStateAction<ModelGraph>>;
    nodeToMove: Node | undefined;
    setNodeToMove: React.Dispatch<React.SetStateAction<Node | undefined>>;
    nodeToLink: Node | undefined;
    setNodeToLink: React.Dispatch<React.SetStateAction<Node | undefined>>;
}

const context = React.createContext<TablesContextProps>({} as TablesContextProps);

export function TablesContext(props: { children: React.ReactNode }) {
    const [graph, setGraph] = React.useState<ModelGraph>(new ModelGraph());
    const [nodeToMove, setNodeToMove] = React.useState<Node | undefined>();
    const [nodeToLink, setNodeToLink] = React.useState<Node | undefined>();
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

    return (
        <context.Provider
            value={{
                graph,
                setGraph,
                nodeToMove,
                setNodeToMove,
                nodeToLink,
                setNodeToLink,
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
