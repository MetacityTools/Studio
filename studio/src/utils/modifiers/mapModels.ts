import { EditorModel } from '@utils/utils';

import { PrimitiveMode } from '@bananagl/bananagl';

export function mapModel(source: EditorModel, taget: EditorModel) {
    if (taget.mode !== PrimitiveMode.TRIANGLES)
        throw new Error('Only Mapping to triangles is supported');

    switch (source.mode) {
        case PrimitiveMode.TRIANGLES:
            return mapModelTriangles(source, taget);
        case PrimitiveMode.LINES:
            return mapModelLines(source, taget);
        case PrimitiveMode.POINTS:
            return mapModelPoints(source, taget);
    }
}

function mapModelTriangles(source: EditorModel, taget: EditorModel) {
    //for all triangles in the source model
    //  find candidate intersections in the target model
    //  for each candidate
    //      compute overlap in 2D
    //      interpolate overlap to 3D
    //      add new triangle to new model
    //  add new model to scene
}

function mapModelLines(source: EditorModel, taget: EditorModel) {
    //TODO
}

function mapModelPoints(source: EditorModel, taget: EditorModel) {
    //TODO
}
