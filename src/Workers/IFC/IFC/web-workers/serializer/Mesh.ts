import { MaterialData } from '../../components/Data';
import { IFCModel } from '../../components/IFCModel';
import { GeometryReconstructor, SerializedGeometry } from './Geometry';
import { MaterialReconstructor, SerializedMaterial } from './Material';

export class SerializedMesh {
    modelID: number;
    geometry: SerializedGeometry;
    materials: SerializedMaterial[] = [];

    constructor(model: IFCModel) {
        this.modelID = model.modelID;
        this.geometry = new SerializedGeometry(model.geometry);
        if (Array.isArray(model.material)) {
            model.material.forEach((mat) => {
                this.materials.push(new SerializedMaterial(mat));
            });
        } else {
            this.materials.push(new SerializedMaterial(model.material));
        }
    }
}

export class MeshReconstructor {
    static new(serialized: SerializedMesh) {
        const geometry = GeometryReconstructor.new(serialized.geometry);
        const materials = MeshReconstructor.getMaterials(serialized);
        const model = new IFCModel(geometry, materials);
        model.modelID = serialized.modelID;
        return model;
    }

    private static getMaterials(serialized: SerializedMesh) {
        const materials: MaterialData[] = [];
        serialized.materials.forEach((mat) => {
            materials.push(MaterialReconstructor.new(mat));
        });
        return materials;
    }
}
