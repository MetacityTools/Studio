import { Model } from '@bananagl/models/model';
import { BVH } from '@bananagl/picking/bvh';
import { TriangleBVH } from '@bananagl/picking/triangles/bvh.triangle';

/***
    @param primitiveIndices are the indices of hit triangles
    @param shiftFlag is true if the shift key was pressed during the pick event
*/
export type OnPickCallback = (
    object: Pickable,
    primitiveIndices: number | number[],
    shiftFlag?: boolean
) => void;

export abstract class Pickable extends Model {
    protected bvh_?: BVH;
    protected onPick_?: OnPickCallback;

    constructor() {
        super();
    }

    set BVH(bvh: BVH | undefined) {
        this.bvh_ = bvh;
    }

    get BVH() {
        return this.bvh_;
    }

    async initTrianglePicking() {
        const bvh = new TriangleBVH(this);
        await bvh.build();
        this.BVH = bvh;
    }

    get onPick() {
        return this.onPick_;
    }

    addPickListener(callback: OnPickCallback | undefined) {
        this.onPick_ = callback;
    }
}
