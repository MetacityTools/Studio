import React from 'react';

import { ModelGraph, Node } from '@utils/hierarchy/graph';

interface TablesContextProps {
    graph: ModelGraph;
    setGraph: React.Dispatch<React.SetStateAction<ModelGraph>>;
    nodeToMove: Node | undefined;
    setNodeToMove: React.Dispatch<React.SetStateAction<Node | undefined>>;
}

export const TablesContext = React.createContext<TablesContextProps>({} as TablesContextProps);

export function TablesContextComponent(props: { children: React.ReactNode }) {
    const [graph, setGraph] = React.useState<ModelGraph>(new ModelGraph());
    const [nodeToMove, setNodeToMove] = React.useState<Node | undefined>();

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
            }}
        >
            {props.children}
        </TablesContext.Provider>
    );
}
