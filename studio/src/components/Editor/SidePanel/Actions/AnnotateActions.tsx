import * as React from 'react';

import { EditorContext } from '@editor/Context';

import { Button } from '@elements/Button';

import { Vitals } from './Vitals';

export function AnnotateActionMenu() {
    const ctx = React.useContext(EditorContext);
    const { renderer, scene } = ctx;

    return (
        <div className="flex flex-row p-4 w-full space-x-2 text-xs border-b">
            <Button>import table</Button>
            <Vitals scenes={[scene]} renderer={renderer} />
        </div>
    );
}
