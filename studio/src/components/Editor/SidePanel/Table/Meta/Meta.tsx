import Editor from '@monaco-editor/react';
import React from 'react';

import { useLinkingNode } from '@editor/Context/TableContext';

import { EmptyMetaEditor } from '@elements/Empty';

import { MetaMenu } from '../Menu/MetaMenu';

export function Meta() {
    const [nodeToLink, setNodeToLink] = useLinkingNode();
    const timeRef = React.useRef<NodeJS.Timeout>();
    const [status, setStatus] = React.useState<'editing' | 'saved' | 'failed' | undefined>();

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
            <MetaMenu status={status} />
            {nodeToLink && (
                <Editor
                    key={nodeToLink.uuid}
                    height="100vh"
                    defaultLanguage="json"
                    defaultValue={JSON.stringify(nodeToLink.data, null, 4)}
                    onChange={handleChange}
                />
            )}
            {!nodeToLink && <EmptyMetaEditor />}
        </div>
    );
}
