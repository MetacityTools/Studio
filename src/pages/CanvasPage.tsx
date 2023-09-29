import { useState } from 'react';

import { Attribute } from '@gl/components/Attribute';
import { Canvas } from '@gl/components/Canvas';
import { Shader } from '@gl/components/Shader';
import { GLContext } from '@gl/context/GLContext';
import { Geometry } from '@gl/context/Geometry';
import { Renderable } from '@gl/context/Renderable';
import { Scene } from '@gl/context/Scene';
import { Buffer } from '@gl/runtime/buffer';
import { fs, vs } from '@gl/shaders/BaseShader';

const triangle = new Float32Array([
    -0.5,
    -0.5,
    0.0, // bottom left
    0.5,
    -0.5,
    0.0, // bottom right
    0.0,
    0.5,
    0.0, // top
]);

const colors = new Float32Array([
    1.0,
    0.0,
    0.0, // bottom left
    0.0,
    1.0,
    0.0, // bottom right
    0.0,
    0.0,
    1.0, // top
]);

export const CanvasPage = () => {
    const [props, setProps] = useState(1);

    window.onclick = () => {
        console.log('click');
        setProps((prev) => prev + 1);
    };

    return (
        <GLContext>
            <Canvas>
                <Scene>
                    {Array.from({ length: props }).map(() => (
                        <Renderable key={Math.random() * 1000}>
                            <Shader vs={vs} fs={fs} />
                            <Geometry>
                                <Attribute name="position" buffer={new Buffer(triangle)} size={3} />
                                <Attribute name="color" buffer={new Buffer(colors)} size={3} />
                            </Geometry>
                        </Renderable>
                    ))}
                </Scene>
            </Canvas>
        </GLContext>
    );
};
