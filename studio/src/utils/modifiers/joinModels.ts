import { vec3 } from 'gl-matrix';

import { EditorModel } from '@utils/models/EditorModel';
import { ModelHierarchyGroup, ModelHierarchyModel } from '@utils/types';
import { EditorModelData, ModelGraph } from '@utils/utils';

function getAllSubmodels(
    model: EditorModel,
    node: ModelHierarchyGroup,
    map: Map<number, ModelHierarchyModel> = new Map()
) {
    for (const child of node.children) {
        if ((child as ModelHierarchyGroup).children) {
            getAllSubmodels(model, child as ModelHierarchyGroup, map);
        } else {
            const modelNode = child as ModelHierarchyModel;
            map.set(modelNode.id, modelNode);
        }
    }
    return map;
}

export async function joinModels(models: EditorModel[], graph: ModelGraph) {
    if (models.length === 0) throw new Error('No models to convert.');

    const positions: Float32Array[] = [];
    const submodels: Uint32Array[] = [];
    let submodelCount = 0;

    const uniforms = {
        uZMin: 0,
        uZMax: 0,
    };

    const graphCopy = graph.exportGraph();

    for (const model of models) {
        //get required attributes
        const p = model.attributes.getAttribute('position');
        const s = model.attributes.getAttribute('submodel');
        if (!p || !s) throw new Error('Required attributes not found during conversion.');

        //get model nodes
        const modelNodes = getAllSubmodels(model, graphCopy.root);

        //convert positions
        const pi = new Float32Array(p.buffer.data.length);
        pi.set(p.buffer.data);
        const v = vec3.create();
        for (let i = 0; i < pi.length; i += 3) {
            vec3.set(v, pi[i], pi[i + 1], pi[i + 2]);
            vec3.transformMat4(v, v, model.transform);
            pi[i] = v[0];
            pi[i + 1] = v[1];
            pi[i + 2] = v[2];
        }
        positions.push(pi as Float32Array);

        //convert submodels
        const view = s.buffer.getView(Uint32Array);
        const si = new Uint32Array(view.length);
        si.set(view);
        const ids = Array.from(new Set<number>(si));
        const map = new Map<number, number>();
        let n: ModelHierarchyModel | undefined, id: number | undefined;
        for (let i = 0; i < ids.length; i++) map.set(ids[i], i);
        for (let i = 0; i < si.length; i++) {
            id = si[i];
            si[i] = map.get(id)! + submodelCount;
            n = modelNodes.get(id);
            if (!n) throw new Error('Model node not found during conversion.');
            n.id = si[i];
        }
        submodels.push(si);

        uniforms.uZMin = model.uniforms.uZMin as number;
        uniforms.uZMax = model.uniforms.uZMax as number;

        //epilogue
        submodelCount += ids.length;
    }

    //concat buffers
    const position = new Float32Array(positions.reduce((a, b) => a + b.length, 0));
    const submodel = new Uint32Array(submodels.reduce((a, b) => a + b.length, 0));
    let offset = 0;
    for (let i = 0; i < positions.length; i++) {
        position.set(positions[i], offset);
        offset += positions[i].length;
    }

    offset = 0;
    for (let i = 0; i < submodels.length; i++) {
        submodel.set(submodels[i], offset);
        offset += submodels[i].length;
    }

    //create model data
    const modelData: EditorModelData = {
        geometry: {
            position,
            submodel,
        },
        metadata: {
            name: 'Joined Model',
            primitive: models[0].primitive, //TODO this is gonna be triangle but maybe we should change it up in the future
        },
        uniforms,
        hierarchy: graphCopy,
    };

    return modelData;
}
