import { vec3 } from "gl-matrix";

import * as GL from "@bananagl/bananagl";

import { GeometryMode, ModelData, ModelMetadataRecords, PrimitiveType } from "./types";

export interface EditorModelData extends ModelData {
  position?: vec3;
  rotation?: vec3;
  scale?: vec3;
  uniforms?: { [name: string]: any };
}

export class EditorModel extends GL.Pickable implements GL.Selectable {
  public name = "Default Model Name";
  public primitive: PrimitiveType = PrimitiveType.UNDEFINED;

  private bbox?: GL.BBox;

  private geometryMode_ = GeometryMode.SOLID;
  public solidShader?: GL.Shader;
  public wireframeShader?: GL.Shader;
  public noEdgesShader?: GL.Shader;
  public metadata: ModelMetadataRecords = {};

  public uuid: string = self.crypto.randomUUID();

  constructor() {
    super();
  }

  cleanUpMetadata() {
    const submodelIds = this.submodelIDs;
    const metadataKeys = Object.keys(this.metadata);

    for (const key of metadataKeys) {
      const numberKey = parseInt(key);
      if (!submodelIds.has(numberKey)) {
        delete this.metadata[numberKey];
      }
    }
  }

  get submodelIDs() {
    const attr = this.attributes.getAttribute("submodel");
    if (!attr) throw new Error("No submodel attribute found");
    const submodel = attr.buffer.getView(Uint32Array) as Uint32Array;
    return new Set(submodel);
  }

  get geometryMode() {
    return this.geometryMode_;
  }

  set geometryMode(mode: GeometryMode) {
    this.geometryMode_ = mode;
    if (mode === GeometryMode.SOLID && this.solidShader) {
      this.shader = this.solidShader;
    } else if (mode === GeometryMode.WIREFRAME && this.wireframeShader) {
      this.shader = this.wireframeShader;
    } else if (mode === GeometryMode.NOEDGES && this.noEdgesShader) {
      this.shader = this.noEdgesShader;
    } else {
      console.warn("No shader found for mode", mode);
    }
  }

  get boundingBox() {
    if (!this.bbox) {
      const pos = this.attributes.getAttribute("position");
      this.bbox = new GL.BBox();
      if (pos) this.bbox.extendArr(pos.buffer.data, 0, pos.buffer.data.length);
    }
    return this.bbox;
  }

  select(submodelIDs: Set<number>) {
    this.selectSubmodels(submodelIDs, 255);
  }

  deselect(submodelIDs: Set<number>) {
    this.selectSubmodels(submodelIDs, 0);
  }

  private lastHighlight = new Set<number>();

  highlight(submodelIDs: Set<number>) {
    if (this.disposed) return;
    if (this.lastHighlight.size > 0) this.selectSubmodels(this.lastHighlight, 0, "highlighted");
    this.selectSubmodels(submodelIDs, 60, "highlighted");
    this.lastHighlight = submodelIDs;
  }

  dehighlight() {
    if (this.disposed) return;
    if (this.lastHighlight.size > 0) this.selectSubmodels(this.lastHighlight, 0, "highlighted");
    this.lastHighlight.clear();
  }

  setColorMap(colormap: Map<number, vec3>) {
    if (this.disposed) return;

    const color = this.attributes.getAttribute("color");
    const submodel = this.attributes.getAttribute("submodel");
    const submodelBuffer = submodel!.buffer.getView(Uint32Array);

    if (!submodel) return;
    if (!color) return;

    let c;
    const whiteness = 0.1;
    const colorf = 1 - whiteness;
    for (let i = 0; i < submodelBuffer.length; i++) {
      c = colormap.get(submodelBuffer[i])!;
      if (c !== undefined) {
        const scidx = i * 3;
        color.buffer.data[scidx] = c[0] * 255 * colorf + 255 * whiteness;
        color.buffer.data[scidx + 1] = c[1] * 255 * colorf + 255 * whiteness;
        color.buffer.data[scidx + 2] = c[2] * 255 * colorf + 255 * whiteness;
      } else {
        const scidx = i * 3;
        color.buffer.data[scidx] = 255;
        color.buffer.data[scidx + 1] = 255;
        color.buffer.data[scidx + 2] = 255;
      }
    }

    color.buffer.toUpdate();
  }

  whiten() {
    if (this.disposed) return;
    const color = this.attributes.getAttribute("color");

    if (!color) return;

    for (let i = 0; i < color.buffer.data.length; i++) {
      color.buffer.data[i] = 255;
    }

    color.buffer.toUpdate();
  }

  private selectSubmodels(submodelIDs: Set<number>, s: number, bufferName: "selected" | "highlighted" = "selected") {
    if (this.disposed) return;
    if (submodelIDs.size === 0) return;
    const selected = this.attributes.getAttribute(bufferName);
    const submodel = this.attributes.getAttribute("submodel");
    const submodelBuffer = submodel!.buffer.getView(Uint32Array);

    if (!submodel) return;
    if (!selected) return;

    for (let i = 0; i < submodelBuffer.length; i++) {
      if (submodelIDs.has(submodelBuffer[i])) selected.buffer.data[i] = s;
    }

    selected.buffer.toUpdate();
  }

  deselectAll() {
    if (this.disposed) return;
    const selected = this.attributes.getAttribute("selected");
    if (!selected) return;
    for (let i = 0; i < selected.buffer.data.length; i++) selected.buffer.data[i] = 0;
    selected.buffer.toUpdate();
  }
}

export const DEFAULT_UNIFORMS = {
  uZMin: 0,
  uZMax: 10,
  uUseShading: 1,
};
