import * as React from 'react';

import { createGroup } from '@utils/hierarchy/groupModels';

import { EditorContext, HierarchyContext } from '@editor/Context';

import { Button } from '@elements/Button';

import { Vitals } from './Vitals';

export function AnnotateActionMenu() {
    const ctx = React.useContext(EditorContext);
    const { renderer, scene, selectedSubmodels } = ctx;
    const hierarchyCtx = React.useContext(HierarchyContext);
    const { graph } = hierarchyCtx;

    const group = () => {
        createGroup(selectedSubmodels, graph);
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 text-xs border-b">
            <Button onClick={group}>group selected</Button>
            <Button>export</Button>
            <Vitals scenes={[scene]} renderer={renderer} />
        </div>
    );
}
