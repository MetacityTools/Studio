import { MetacityData, ModelData, UserInputModel } from '@utils/types';

import { readModel } from './read';

export function parse(model: UserInputModel): ModelData {
    const parsedModel = readModel((model.data as MetacityData).buffer);
    return parsedModel;
}
