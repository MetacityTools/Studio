import { Attribute } from "@bananagl/bananagl";

import { BVHNode } from "../bvh";
import {
  BuilderOutput,
  fromTransferable,
  getTrasferables,
  reconstructBBoxes,
  toTransferable,
} from "./transform";

export async function buildBVHInWorker(position: Attribute, attr: Attribute[]) {
  const data = toTransferable(position, attr);
  const transferables = getTrasferables(data);
  return new Promise<BVHNode>((resolve) => {
    const worker = new Worker(new URL("./build.worker.ts", import.meta.url));
    worker.onmessage = (e) => {
      const data = e.data as BuilderOutput;
      fromTransferable(position, attr, data.data);
      reconstructBBoxes(data.rootNode);
      resolve(data.rootNode);
      worker.terminate();
    };
    worker.postMessage(data, transferables);
  });
}
