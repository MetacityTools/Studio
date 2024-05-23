import Editor from '@monaco-editor/react';
import React from 'react';

import { applyEdits, combineData } from '@utils/metadata';

import { Empty } from '@elements/Empty';

import { useDarkmode } from '@hooks/useDarkmode';
import { useLogger } from '@hooks/useLogger';
import { useUpdateMetadata } from '@hooks/useMetadataUpdate';
import { useSelected } from '@hooks/useSelected';

export function MetadataEditor() {
    const timeRef = React.useRef<NodeJS.Timeout>();
    const [key, setKey] = React.useState('');
    const [content, setContent] = React.useState({});

    const selected = useSelected();
    const [darkmode] = useDarkmode();
    const updateMetadata = useUpdateMetadata();
    const log = useLogger();

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleChange = (value: string | undefined, event: any) => {
        if (timeRef.current) clearTimeout(timeRef.current);
        log('Saving metadata');
        timeRef.current = setTimeout(() => {
            try {
                try {
                    const edited = JSON.parse(value || '');
                    applyEdits(selected, content, edited);
                    setContent(edited);
                    updateMetadata();
                    log('Metadata saved');
                } catch (e) {
                    console.warn(e);
                    log('Failed to save metadata');
                }
            } catch (e) {}
        }, 1000);
    };

    React.useEffect(() => {
        const { common } = combineData(selected);
        setContent(common);
        setKey(
            Array.from(selected)
                .map(([model, submodels]) => model.name + joinNums(submodels))
                .join('-')
        );
    }, [selected, setContent]);

    let size = 0;
    selected.forEach((set) => (size += set.size));
    if (size === 0) return <Empty>Nothing selected</Empty>;

    return (
        <div className="w-full h-full" onKeyDown={handleKey} onKeyUp={handleKey}>
            <Editor
                key={key}
                height="100%"
                defaultLanguage="json"
                defaultValue={JSON.stringify(content, null, 4)}
                onChange={handleChange}
                theme={darkmode ? 'vs-dark' : 'vs-light'}
            />
        </div>
    );
}

function joinNums(nums: Set<number>) {
    return Array.from(nums).sort().join('-');
}
