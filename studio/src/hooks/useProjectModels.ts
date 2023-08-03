import { overlapProjectedTriangle } from '@metacity/geometry';
import { mat4, vec2, vec3 } from 'gl-matrix';
import React from 'react';

import { EditorModel } from '@data/EditorModel';
import { PrimitiveType } from '@data/types';

import { context } from '@context/ViewContext';

import { useImportModels } from './useImportModels';

export function useProjectModels() {
    const ctx = React.useContext(context);
    const importModels = useImportModels();

    const project = async (source: EditorModel, target: EditorModel) => {
        //projeciton map
        const mappedModel = await projectModels(source, target);

        //add the new model
        await importModels([mappedModel]);
    };

    return project;
}

async function projectModels(source: EditorModel, target: EditorModel) {
    const spos = source.attributes.getAttribute('position');
    if (!spos) throw new Error('Source model has no position attribute');
    let sbuffer = spos.buffer.data as Float32Array;
    const ssubmodel = source.attributes.getAttribute('submodel');
    if (!ssubmodel) throw new Error('Source model has no submodel attribute');
    let ssubmodelbuffer = ssubmodel.buffer.getView(Uint32Array) as Uint32Array;
    if (source.primitive !== PrimitiveType.TRIANGLES)
        throw new Error('Source model is not triangulated');
    if (target.primitive !== PrimitiveType.TRIANGLES)
        throw new Error('Target model is not triangulated');
    const targetBVH = target.BVH;
    if (!targetBVH) throw new Error('Target model has no BVH');
    const tpos = target.attributes.getAttribute('position');
    if (!tpos) throw new Error('Target model has no position attribute');
    let tbuffer = tpos.buffer.data as Float32Array;

    const triSource = new Float32Array(9);
    const triTarget = new Float32Array(9);
    const from = vec2.create();
    const to = vec2.create();

    //apply transform, rebuild BVH, yes this is how we do it
    applyTransform(sbuffer, source.transform);
    source.resetTransform();
    await source.BVH?.rebuild();
    spos.buffer.toUpdate();
    sbuffer = spos.buffer.data as Float32Array;
    ssubmodelbuffer = ssubmodel.buffer.getView(Uint32Array) as Uint32Array;
    applyTransform(tbuffer, target.transform);
    target.resetTransform();
    await targetBVH.rebuild();
    tpos.buffer.toUpdate();
    tbuffer = tpos.buffer.data as Float32Array;

    let index = 0,
        submodelIndex = 0;
    const projected = [];
    const submodel = [];
    for (let i = 0; i < spos.count; i += 9) {
        //cache source triangle
        triSource.set(sbuffer.subarray(i, i + 9));
        submodelIndex = ssubmodelbuffer[i / 3];
        from[0] = Math.min(triSource[0], triSource[3], triSource[6]);
        from[1] = Math.min(triSource[1], triSource[4], triSource[7]);
        to[0] = Math.max(triSource[0], triSource[3], triSource[6]);
        to[1] = Math.max(triSource[1], triSource[4], triSource[7]);
        //trace overlaping triangles
        const triIndices = targetBVH.traceArea(from, to);
        //for each overlaping triangle
        for (let j = 0; j < triIndices.length; j++) {
            index = triIndices[j] * 9;
            //extract triangle from target and project source onto target
            triTarget.set(tbuffer.subarray(index, index + 9));
            //compute overlap
            const overlap = overlapProjectedTriangle(triSource, triTarget);
            if (overlap.length > 0) {
                //add the projection to the new model
                projected.push(...overlap);
                const triCount = overlap.length / 3;
                for (let k = 0; k < triCount; k++) submodel.push(submodelIndex);
            }
        }
    }

    return {
        uniforms: source.uniforms,
        geometry: {
            position: new Float32Array(projected),
            submodel: new Uint32Array(submodel),
        },
        metadata: {
            name: source.name + ' projected onto ' + target.name,
            primitive: PrimitiveType.TRIANGLES,
            data: source.metadata,
        },
    };
}

function applyTransform(buffer: Float32Array, mat: mat4) {
    const pi = buffer;
    const v = vec3.create();
    for (let i = 0; i < pi.length; i += 3) {
        vec3.set(v, pi[i], pi[i + 1], pi[i + 2]);
        vec3.transformMat4(v, v, mat);
        pi[i] = v[0];
        pi[i + 1] = v[1];
        pi[i + 2] = v[2];
    }
}
