//worker to parse models
import { parse } from './gltf/parse';

self.onmessage = (e) => {
    process(e.data);
};

async function process(data: any) {
    const geometry = await parse(data);
    (self as any).postMessage(
        {
            name: data.name,
            geometry: geometry,
        },
        [geometry.position.buffer]
    );
}
