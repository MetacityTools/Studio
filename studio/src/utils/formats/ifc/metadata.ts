import { IFCLoader } from 'web-ifc-three';
import { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';

import { IFCModelData } from '@data/types';

export function retrieveMetadata(model: IFCModel, loader: IFCLoader, models: IFCModelData[]) {
    const uniqueSubmodels = new Set<number>();
    models.forEach((m) => m.geometry.expressID.forEach((id) => uniqueSubmodels.add(id)));
    const uniqueSubArray = Array.from(uniqueSubmodels);

    const metadata: { [submodel: number]: any } = {};
    uniqueSubArray.forEach((id) => {
        metadata[id] = {
            metadata: 'IFC metadata TBA',
        };
    });

    return metadata;
}

/*export async function retrieveMetadata(model: IFCModel, loader: IFCLoader, models: IFCModelData[]) {
    const ifc = loader.ifcManager;
    const modelID = model.modelID;

    const uniqueSubmodels = new Set<number>();
    models.forEach((m) => m.geometry.expressID.forEach((id) => uniqueSubmodels.add(id)));
    const uniqueSubArray = Array.from(uniqueSubmodels);

    const submodelMetadata = await Promise.all(
        uniqueSubArray.map((id) => {
            return ifc.getMaterialsProperties(modelID, id, true);
        })
    );

    const submodelMetadataMap = new Map<number, any>();
    uniqueSubArray.forEach((id, i) => {
        submodelMetadataMap.set(id, declass(submodelMetadata[i]));
    });

    const metadata: { [submodel: number]: any } = {};
    models.forEach((m) => {
        m.geometry.expressID.forEach((id) => {
            metadata[id] = submodelMetadataMap.get(id);
        });
    });

    return metadata;
}

//this is extremely dirty
function declass(data: any) {
    return JSON.parse(JSON.stringify(data, null, 0));
}
*/
