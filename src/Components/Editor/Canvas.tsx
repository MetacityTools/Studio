import React from 'react';

import { GridModel } from '@utils/models/models/GridModel';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from './Context';

export function Canvas() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const ctx = React.useContext(EditorContext);

    React.useEffect(() => {
        if (!ctx) return;
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

            return () => {
                GL.unmountRenderer(renderer);
                scene.remove(grid);
            };
        }
    }, [ctx?.renderer, ctx?.scene]);

    return (
        <canvas
            ref={canvasRef}
            key="canvas"
            tabIndex={1000}
            style={{
                width: '100%',
                height: '100%',
                outline: 'none',
            }}
        />
    );
}
