import { MaterialData } from '../../components/Data';

export class SerializedMaterial {
    color: number[];
    opacity: number;
    transparent: boolean;

    constructor(material: MaterialData) {
        this.color = [...material.color];
        this.opacity = material.opacity;
        this.transparent = material.transparent;
    }
}

export class MaterialReconstructor {
    static new(material: SerializedMaterial) {
        return new MaterialData(
            [material.color[0], material.color[1], material.color[2]],
            material.opacity,
            material.transparent
        );
    }
}
