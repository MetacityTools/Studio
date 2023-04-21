import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

import { Model } from '@bananagl/bananagl';

export function modelToGltf(model: Model) {
    const exporter = new GLTFExporter();
    const position = model.attributes.getAttribute('position');
    if (!position) throw new Error('Model does not have a position attribute');

    const bufferData = position.buffer.data;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(bufferData, 3));

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const mesh = new THREE.Mesh(geometry, material);

    exporter.parse(
        mesh,
        (result) => {
            const data = result as ArrayBuffer;

            //to file and download
            const blob = new Blob([data], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'model.glb';
            link.click();
        },
        (error) => {
            console.error(error);
        },
        {
            binary: true,
        }
    );
}
