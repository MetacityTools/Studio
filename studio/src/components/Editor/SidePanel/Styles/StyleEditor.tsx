import Editor from '@monaco-editor/react';
import { useMonaco } from '@monaco-editor/react';
import React from 'react';

import { useStyle } from '@shared/Context/hooks';

export function StyleEditor() {
    const timeRef = React.useRef<NodeJS.Timeout>();
    const monaco = useMonaco();
    const [style, setStyle] = useStyle();

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

    React.useEffect(() => {
        if (monaco) {
            //update contents of the editor
            monaco.editor.getModels().forEach((model) => {
                model.setValue(JSON.stringify(style, null, 4));
            });
        }
    }, [monaco, style]);

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
