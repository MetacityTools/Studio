import React from 'react';

import { Canvas, addGridModel } from '@utils/utils';
import { useRenderer, useScene } from '@utils/utils';

import * as GL from '@bananagl/bananagl';

export function CanvasView() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const scene = useScene();
    const renderer = useRenderer();

    React.useEffect(() => {
        if (canvasRef.current && renderer) {
            GL.mountRenderer(canvasRef.current, renderer, {}, [
                {
                    view: new GL.View(scene),
                    size: {
                        mode: 'relative',
                        width: 100,
                        height: 100,
                    },
                    position: {
                        mode: 'relative',
                        top: 0,
                        left: 0,
                    },
                },
            ]);

            addGridModel(scene);
            renderer.clearColor = [1, 1, 1, 1];

            const down = (e: KeyboardEvent) => {
                renderer.window.controls.keydown(e);
            };

            const up = (e: KeyboardEvent) => {
                renderer.window.controls.keyup(e);
            };

            document.addEventListener('keydown', down);
            document.addEventListener('keyup', up);

            return () => {
                document.removeEventListener('keydown', down);
                document.removeEventListener('keyup', up);
                GL.unmountRenderer(renderer);
            };
        }
    }, [renderer, scene]);

    return (
        <>
            <Canvas canvasRef={canvasRef} />
        </>
    );
}
