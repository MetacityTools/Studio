import Editor from '@monaco-editor/react';
import { useMonaco } from '@monaco-editor/react';
import React from 'react';

import { useStatus } from '@editor/EditorContext';

import { useStyle } from '@shared/Context/hooks';

export function StyleEditor() {
    const timeRef = React.useRef<NodeJS.Timeout>();
    const monaco = useMonaco();
    const [style, setStyle] = useStyle();
    const [content, setContent] = React.useState(style);
    const [_, setStatus] = useStatus();

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    React.useEffect(() => {
        if (monaco) {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: true,
                schemas: [
                    {
                        uri: 'https://raw.githubusercontent.com/MetacityTools/Schemas/main/style-schema.json',
                        fileMatch: ['*'],
                    },
                ],
                enableSchemaRequest: true,
            });
        }
    }, [monaco]);

    const handleChange = (value: string | undefined, event: any) => {
        if (timeRef.current) clearTimeout(timeRef.current);
        setStatus('editing');
        timeRef.current = setTimeout(() => {
            try {
                try {
                    const edited = JSON.parse(value || '');
                    setStyle(edited);
                    setContent(edited);
                    setStatus('saved');
                } catch (e) {
                    console.error(e);
                    setStatus('failed');
                }
            } catch (e) {}
        }, 1000);
    };

    //refactor to allow content injection
    //React.useEffect(() => {
    //    setContent(style);
    //    if (monaco) {
    //        monaco.editor
    //            .getModels()
    //            .forEach((model) => model.setValue(JSON.stringify(style, null, 4)));
    //    }
    //}, [style, setContent]);

    return (
        <div className="w-full h-full" onKeyDown={handleKey} onKeyUp={handleKey}>
            <Editor
                height="100%"
                defaultLanguage="json"
                defaultValue={JSON.stringify(content, null, 4)}
                onChange={handleChange}
            />
        </div>
    );
}
