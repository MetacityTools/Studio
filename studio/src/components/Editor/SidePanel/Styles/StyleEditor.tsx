import Editor from '@monaco-editor/react';
import React from 'react';

export function StyleEditor() {
    const timeRef = React.useRef<NodeJS.Timeout>();

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleChange = (value: string | undefined, event: any) => {
        if (timeRef.current) clearTimeout(timeRef.current);
        timeRef.current = setTimeout(() => {
            try {
                try {
                    const edited = JSON.parse(value || '');
                    console.log(edited);
                } catch (e) {
                    console.error(e);
                }
            } catch (e) {}
        }, 1000);
    };

    return (
        <div className="w-full h-full" onKeyDown={handleKey} onKeyUp={handleKey}>
            <Editor
                height="100%"
                defaultLanguage="json"
                defaultValue={JSON.stringify({}, null, 4)}
                onChange={handleChange}
            />
        </div>
    );
}
