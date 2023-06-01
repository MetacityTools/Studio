import React from 'react';

import { ModelGraph, Node } from '@utils/hierarchy/graph';

interface TablesContextProps {
    graph: ModelGraph;
    setGraph: React.Dispatch<React.SetStateAction<ModelGraph>>;
    nodeToMove: Node | undefined;
    setNodeToMove: React.Dispatch<React.SetStateAction<Node | undefined>>;
    tables: string[][][];
    setTables: React.Dispatch<React.SetStateAction<string[][][]>>;
}

export const TablesContext = React.createContext<TablesContextProps>({} as TablesContextProps);

export function TablesContextComponent(props: { children: React.ReactNode }) {
    const [graph, setGraph] = React.useState<ModelGraph>(new ModelGraph());
    const [nodeToMove, setNodeToMove] = React.useState<Node | undefined>();
    const [tables, setTables] = React.useState<string[][][]>([]);

    React.useEffect(() => {
        graph.addChangeListener(() => {
            const updated = new ModelGraph();
            updated.copy(graph);
            setGraph(updated);
        });
    }, [graph]);

    return (
        <TablesContext.Provider
            value={{
                graph,
                setGraph,
                nodeToMove,
                setNodeToMove,
                tables,
                setTables,
            }}
        >
            {props.children}
        </TablesContext.Provider>
    );
}
