import { load } from './formats/loader';
import { EditorModel } from './models/EditorModel';
import { EditorModelData } from './models/TriangleModel';
import { addGridModel } from './models/addGridModel';
import { CoordinateMode, alignModels } from './modifiers/alignVertices';
import { autoUpdateStyle } from './modifiers/autoUpdateStyle';
import { computeDots, computeNormals } from './modifiers/computeNormals';
import { filterMetadata } from './modifiers/filterMetadata';
import { joinSubmodels } from './modifiers/joinSubmodels';
import { projectModels } from './modifiers/projectModels';
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
    autoUpdateStyle,
    filterMetadata,
    projectModels,
    CoordinateMode,
};

export * from './types';
export type { EditorModelData };
