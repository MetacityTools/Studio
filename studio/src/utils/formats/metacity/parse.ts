import { MetacityData, ModelData, UserInputModel } from '@data/types';

import { readModels } from './read';

export function parse(model: UserInputModel): ModelData[] {
    const parsedModel = readModels((model.data as MetacityData).buffer);
    return parsedModel;
}
