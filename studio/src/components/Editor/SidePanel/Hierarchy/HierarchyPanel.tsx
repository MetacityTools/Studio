import React from 'react';

import { ModelGroupNode } from '@utils/hierarchy/modelGraph';
import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext, HierarchyContext } from '@editor/Context';

import { GroupNodePanel } from './GroupPanel';

export function HierarchyPanel() {
    const ctx = React.useContext(EditorContext);
    const hierarchyCtx = React.useContext(HierarchyContext);
    const { graph } = hierarchyCtx;
    const { models, selectedSubmodels } = ctx;

    const mainModel = models.filter((model) => model instanceof EditorModel)[0];
    const submodels = React.useMemo(() => new Set(selectedSubmodels), [selectedSubmodels]);

    function createGroup() {
        const selected = selectedSubmodels;
        const newGroup = new ModelGroupNode();
        let lastParent = null;

        //TODO here you will have to eliminate all the submodels that are already in a group and all of them are selected

        for (const submodelId of selected) {
            const submodel = graph.getModelNode(submodelId);

            if (submodel) {
                lastParent = submodel.parent;
                submodel.parent?.removeChild(submodel);
                submodel.addParent(newGroup);
                newGroup.addChild(submodel);
            }
        }

        if (lastParent) {
            lastParent.addChild(newGroup);
            newGroup.addParent(lastParent);
        }

        graph.needsUpdate = true;
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div onClick={createGroup}>group selected</div>
            <div>deselect all</div>
            <div className="flex flex-col flex-grow overflow-y-auto p-4">
                <GroupNodePanel model={mainModel} submodels={submodels} node={graph.root} />
            </div>
        </div>
    );
}
