import { load } from './formats/loader';
import { EditorModel } from './models/EditorModel';
import { EditorModelData } from './models/TriangleModel';
import { addGridModel } from './models/addGridModel';
import { CoordinateMode, alignModels } from './modifiers/alignVertices';
import { computeDots, computeNormals } from './modifiers/computeNormals';
import { joinSubmodels } from './modifiers/joinSubmodels';
import { splitModel } from './modifiers/splitModels';
import { Tables } from './tables/tables';

export {
    load,
    Tables,
    EditorModel,
    addGridModel,
    alignModels,
    computeDots,
    computeNormals,
    joinSubmodels,
    splitModel,
    CoordinateMode,
};

export * from './types';
export type { EditorModelData };
