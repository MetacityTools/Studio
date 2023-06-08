import Editor from '@monaco-editor/react';

import { useLinkingNode } from '@editor/Context/TableContext';

import { EmptyMetaEditor } from '@elements/Empty';

import { MetaMenu } from '../Menu/MetaMenu';

export function Meta() {
    const [nodeToLink, setNodeToLink] = useLinkingNode();

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleChange = (value: string | undefined, event: any) => {
        //TODO assign metadata to nodes
        console.log(value);
    };

    return (
        <div className="flex flex-col w-full h-full" onKeyDown={handleKey} onKeyUp={handleKey}>
            <MetaMenu />
            {nodeToLink && (
                <Editor
                    height="100vh"
                    defaultLanguage="JSON"
                    defaultValue="// some comment"
                    onChange={handleChange}
                />
            )}
            {!nodeToLink && <EmptyMetaEditor />}
        </div>
    );
}
