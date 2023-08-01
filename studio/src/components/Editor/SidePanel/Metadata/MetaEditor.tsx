import Editor from '@monaco-editor/react';
import React from 'react';

import { Empty } from '@elements/Empty';
import { useLogger } from '@elements/GlobalContext';

import { useDarkmode, useMetadata, useSelectedModels } from '@shared/Context/hooks';
import { applyEdits, combineData } from '@shared/Context/metadata';

function joinNums(nums: Set<number>) {
    return Array.from(nums).sort().join('-');
}

export function MetaEditor() {
    const timeRef = React.useRef<NodeJS.Timeout>();
    const selected = useSelectedModels();
    const [content, setContent] = React.useState({});
    const [key, setKey] = React.useState('');
    const [_, updateGlobalMetadata] = useMetadata();
    const log = useLogger();
    const [darkmode] = useDarkmode();

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
                    updateGlobalMetadata();
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
