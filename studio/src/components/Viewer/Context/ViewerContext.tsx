import React from 'react';

import { MetadataNode } from '@utils/types';
import { extractMetadataTree } from '@utils/utils';
import { useGraph } from '@utils/utils';

interface ViewerContextProps {
    metadata: MetadataNode;
    setMetadata: React.Dispatch<React.SetStateAction<MetadataNode>>;
}

const context = React.createContext<ViewerContextProps>({} as ViewerContextProps);

export function ViewerContext(props: { children: React.ReactNode }) {
    const [metadata, setMetadata] = React.useState<MetadataNode>({});
    const [graph, setGraph] = useGraph();

    React.useEffect(() => {
        if (graph) {
            const metadata = extractMetadataTree(graph);
            setMetadata(metadata);
            console.log(metadata);
        }
    }, [graph, setMetadata]);

    return (
        <context.Provider
            value={{
                metadata,
                setMetadata,
            }}
        >
            {props.children}
        </context.Provider>
    );
}

export function useViewerContext(): ViewerContextProps {
    return React.useContext(context);
}

export function useMetadata(): [MetadataNode, React.Dispatch<React.SetStateAction<MetadataNode>>] {
    const { metadata, setMetadata } = useViewerContext();
    return [metadata, setMetadata];
}
