import Editor from '@monaco-editor/react';
import React from 'react';

import { useEditingNode, useStatus } from '@editor/Context/TableContext';

import { Empty } from '@elements/Empty';

export function MetaEditor() {
    const [nodeToLink, setNodeToLink] = useEditingNode();
    const timeRef = React.useRef<NodeJS.Timeout>();
    const [status, setStatus] = useStatus();

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleChange = (value: string | undefined, event: any) => {
        if (timeRef.current) clearTimeout(timeRef.current);
        setStatus('editing');
        timeRef.current = setTimeout(() => {
            try {
                try {
                    const data = JSON.parse(value || '');
                    nodeToLink?.setData(data);
                    setStatus('saved');
                } catch (e) {
                    setStatus('failed');
                }
            } catch (e) {}
        }, 1000);
    };

    React.useEffect(() => {
        if (!nodeToLink) {
            setStatus(undefined);
        } else {
            setStatus('editing');
        }
    }, [nodeToLink]);

    return (
        <div className="flex flex-col w-full h-full" onKeyDown={handleKey} onKeyUp={handleKey}>
            {nodeToLink && (
                <Editor
                    key={nodeToLink.uuid}
                    height="100vh"
                    defaultLanguage="json"
                    defaultValue={JSON.stringify(nodeToLink.data, null, 4)}
                    onChange={handleChange}
                />
            )}
            {!nodeToLink && <Empty>Nothing selected</Empty>}
        </div>
    );
}
