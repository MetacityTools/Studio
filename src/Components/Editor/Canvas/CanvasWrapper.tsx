import React from 'react';

import { GridModel } from '@utils/models/models/GridModel';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '../Context';
import { Canvas } from './Canvas';

export function CanvasWrapper() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const ctx = React.useContext(EditorContext);

    React.useEffect(() => {
        const { renderer, scene } = ctx;

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

            const grid = GridModel();
            scene.add(grid);
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
                scene.remove(grid);
            };
        }
    }, [ctx.renderer, ctx.scene]);

    return <Canvas canvasRef={canvasRef} />;
}
