export interface UserInputModel {
    name: string;
    buffer: ArrayBuffer;
}

export type Vec3 = [number, number, number];

export type BrickFace = Vec3[];
export type BrickModel = BrickFace[];

export interface Brick {
    model?: BrickModel;
}
