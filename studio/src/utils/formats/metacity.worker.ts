//worker to parse models
import { parse } from './metacity/parse';

self.onmessage = (e) => {
    process(e.data);
};

async function process(data: any) {
    const model = parse(data);
    (self as any).postMessage(model, [
        model.geometry.position.buffer,
        model.geometry.submodel.buffer,
    ]);
}
