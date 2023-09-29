import { createContext, useEffect, useRef, useState } from 'react';

import { useGL } from '@gl/hooks/useGL';
import { useResize } from '@gl/hooks/useResize';
import { Camera } from '@gl/runtime/camera';
import { SortedRenderables, renderPass } from '@gl/runtime/renderPass';
import { Renderable } from '@gl/runtime/renderable';

interface SceneProviderProps {
    renderables: Map<string, Renderable>;
    setRenderables: React.Dispatch<React.SetStateAction<Map<string, Renderable>>>;
    afterRenderCallbacks?: React.RefObject<(() => void)[]>;
}

export const context = createContext<SceneProviderProps>({} as SceneProviderProps);

type SceneProps = {
    children: React.ReactNode;
};

export const Scene = (props: SceneProps) => {
    const [sortedRenderables, setSortedRenderables] = useState<SortedRenderables>({
        opaqueObjects: [],
        transparentObjects: [],
        noDepthObjects: [],
    });
    const [renderables, setRenderables] = useState<Map<string, Renderable>>(new Map());
    const [camera] = useState<Camera>(new Camera());
    const afterRenderCallbacks = useRef<(() => void)[]>([]);
    const [size] = useResize();
    const [gl] = useGL();

    //update camera
    useEffect(() => {
        if (!gl) return;
        camera.updateScreenSize(size.width, size.height);
        gl.viewport(0, 0, size.width, size.height);
        gl.scissor(0, 0, size.width, size.height);
    }, [size]);

    //render loop for the scene
    useEffect(() => {
        let frame: number;
        const render = () => {
            if (!gl) return;
            renderPass(gl, sortedRenderables, camera);
            frame = requestAnimationFrame(render);
            //handle after render callbacks
            afterRenderCallbacks.current.forEach((callback) => callback());
            afterRenderCallbacks.current = [];
        };

        frame = requestAnimationFrame(render);
        return () => cancelAnimationFrame(frame);
    }, [size, gl, sortedRenderables, camera]);

    //sort renderables according to shaders
    useEffect(() => {
        console.log(renderables);
        const objects = Array.from(renderables.values());

        const shaderSort = (a: Renderable, b: Renderable) => {
            const shaderA = a.shader;
            const shaderB = b.shader;
            if (shaderA === shaderB) return 0;
            return shaderA < shaderB ? -1 : 1;
        };

        const opaqueObjects = objects
            .filter((object) => !object.shader.transparency && object.shader.depth)
            .sort(shaderSort);

        const transparentObjects = objects
            .filter((object) => object.shader.transparency && object.shader.depth)
            .sort(shaderSort);

        const noDepthObjects = objects
            .filter((object) => object.shader.depth === false)
            .sort(shaderSort);

        setSortedRenderables({
            opaqueObjects,
            transparentObjects,
            noDepthObjects,
        });
    }, [renderables]);

    return (
        <context.Provider
            value={{
                renderables,
                setRenderables,
                afterRenderCallbacks,
            }}
        >
            {props.children}
        </context.Provider>
    );
};
