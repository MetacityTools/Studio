import { Model } from "@bananagl/models/model";
import { BVH } from "@bananagl/picking/bvh";
import { TriangleBVH } from "@bananagl/picking/triangles/bvh.triangle";

export abstract class Pickable extends Model {
  protected bvh_?: BVH;

  //flag for the picking algo
  //to skip picking this object
  skipPicking: boolean = false;

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
}
