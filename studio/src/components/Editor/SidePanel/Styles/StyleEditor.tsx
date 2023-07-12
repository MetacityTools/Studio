import Editor from '@monaco-editor/react';
import { useMonaco } from '@monaco-editor/react';
import equal from 'fast-deep-equal/es6';
import React from 'react';

import { useStatus } from '@editor/EditorContext';

import { useStyle } from '@shared/Context/hooks';

export function StyleEditor() {
    const timeRef = React.useRef<NodeJS.Timeout>();
    const monaco = useMonaco();
    const [style, setStyle] = useStyle();
    //keep the content sepearate so you can diferenciate between internal and external updates of style
    const [content, setContent] = React.useState<string>(JSON.stringify(style, null, 4));
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
                    setStatus('saved');
                    setContent(value ?? '');
                } catch (e) {
                    console.warn(e);
                    setStatus('failed');
                }
            } catch (e) {}
        }, 1000);
    };

    React.useEffect(() => {
        if (!equal(style, JSON.parse(content))) {
            setContent(JSON.stringify(style, null, 4));
            if (monaco) {
                monaco.editor
                    .getModels()
                    .forEach((model) => model.setValue(JSON.stringify(style, null, 4)));
            }
        }
    }, [style, content]);

    return (
        <div className="w-full h-full" onKeyDown={handleKey} onKeyUp={handleKey}>
            <Editor
                key="StyleEditor"
                height="100%"
                defaultLanguage="json"
                defaultValue={content}
                onChange={handleChange}
            />
        </div>
    );
}
