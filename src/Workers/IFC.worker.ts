import { TypedArray, UserInputModel } from 'types';
import { FlatMesh, IfcAPI, IfcGeometry, PlacedGeometry, Vector } from 'web-ifc/web-ifc-api';

class IFCLoader {
    readonly data: { [item: number]: TypedArray } = {};
    private api = new IfcAPI();
    private modelID = -1;
    constructor() {
        this.api.SetWasmPath('/', true);
    }

    async loadIFC(name: string, buffer: ArrayBuffer) {
        await this.api.Init();
        console.log(this.api);

        const bufferui8 = new Uint8Array(buffer);
        console.log(`Loading IFC model ${name} with size ${bufferui8.length}`);
        this.modelID = await this.api.OpenModel(bufferui8);
        this.api.StreamAllMeshes(this.modelID, (mesh: FlatMesh) => {
            this.streamMesh(this.modelID, mesh);
        });
    }

    private streamMesh(modelID: number, mesh: FlatMesh) {
        const placedGeometries = mesh.geometries;
        const size = placedGeometries.size();

        for (let i = 0; i < size; i++) {
            const placedGeometry = placedGeometries.get(i);
            let buffer = this.getPlacedGeometry(modelID, mesh.expressID, placedGeometry);
            this.applyMatrixToBuffer(buffer, placedGeometry.flatTransformation);
            this.data[mesh.expressID] = buffer;
        }
    }

    private getPlacedGeometry(modelID: number, expressID: number, placedGeometry: PlacedGeometry) {
        const geometry = this.getBufferGeometry(modelID, expressID, placedGeometry);
        return geometry;
    }

    private getBufferGeometry(modelID: number, expressID: number, placedGeometry: PlacedGeometry) {
        const geometry = this.api.GetGeometry(
            modelID,
            placedGeometry.geometryExpressID
        ) as IfcGeometry;
        const verts = this.api.GetVertexArray(
            geometry.GetVertexData(),
            geometry.GetVertexDataSize()
        ) as Float32Array;
        const indices = this.api.GetIndexArray(
            geometry.GetIndexData(),
            geometry.GetIndexDataSize()
        ) as Uint32Array;
        const buffer = this.ifcGeometryToBuffer(verts, indices);
        //@ts-ignore
        geometry.delete(); // free memory??
        return buffer;
    }

    private ifcGeometryToBuffer(vertexData: Float32Array, indexData: Uint32Array) {
        const positions = new Float32Array(indexData.length * 3);
        let index: number;
        for (let i = 0; i < indexData.length; i++) {
            index = indexData[i] * 6; // 6 because of the 3 coordinates and 3 normals
            positions[i * 3] = vertexData[index];
            positions[i * 3 + 1] = vertexData[index + 1];
            positions[i * 3 + 2] = vertexData[index + 2];
        }
        return positions;
    }

    private applyMatrixToBuffer(buffer: Float32Array, matrix: number[]) {
        for (let i = 0; i < buffer.length; i += 3) {
            buffer[i] =
                buffer[i] * matrix[0] +
                buffer[i + 1] * matrix[1] +
                buffer[i + 2] * matrix[2] +
                matrix[3];
            buffer[i + 1] =
                buffer[i] * matrix[4] +
                buffer[i + 1] * matrix[5] +
                buffer[i + 2] * matrix[6] +
                matrix[7];
            buffer[i + 2] =
                buffer[i] * matrix[8] +
                buffer[i + 1] * matrix[9] +
                buffer[i + 2] * matrix[10] +
                matrix[11];
        }
    }

    get transferables() {
        return Object.values(this.data).map((buffer) => buffer.buffer);
    }
}

export function parseIFC(models: UserInputModel[]) {
    console.log(`Loading ${models.length} models`);
    models.forEach(async (model) => {
        if (model.name.endsWith('.ifc')) {
            console.log(`Loading IFC model ${model.name}`);
            const ifcLoader = new IFCLoader();
            await ifcLoader.loadIFC(model.name, model.buffer);
            (self as any).postMessage(
                {
                    name: model.name,
                    data: ifcLoader.data,
                },
                ifcLoader.transferables
            );
        }
    });
}

self.onmessage = (e) => {
    parseIFC(e.data);
};
