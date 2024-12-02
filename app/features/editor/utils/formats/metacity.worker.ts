//worker to parse models
import { errorHandler } from "./errors";
import { parse } from "./metacity/parse";

self.onmessage = (e) => {
  errorHandler(process(e.data));
};

async function process(data: any) {
  const models = parse(data);

  const trnsfrbl = models.models
    .map((model) => [
      model.geometry.position.buffer,
      model.geometry.submodel.buffer,
    ])
    .flat();

  (self as any).postMessage(models, trnsfrbl);
}
