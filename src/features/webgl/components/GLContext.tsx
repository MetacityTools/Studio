import React, { createContext, useEffect, useRef, useState } from 'react';

import { Shader } from '@gl/runtime/shader';

interface GLContextProviderProps {
    gl?: WebGL2RenderingContext;
    setGL: React.Dispatch<React.SetStateAction<WebGL2RenderingContext | undefined>>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    shaders: Map<string, Shader>;
    setShaders: React.Dispatch<React.SetStateAction<Map<string, Shader>>>;
}

export const context = createContext<GLContextProviderProps>({} as GLContextProviderProps);

type GLContextProps = {
    options?: WebGLContextAttributes;
    children: React.ReactNode;
};

export const GLContext = (props: GLContextProps) => {
    const { options } = props;
    const [gl, setGL] = useState<WebGL2RenderingContext | undefined>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [shaders, setShaders] = useState<Map<string, Shader>>(new Map());

    useEffect(() => {
        if (canvasRef.current === null) return;
        const gl = canvasRef.current.getContext('webgl2', {
            antialias: options?.antialias ?? true,
            alpha: options?.alpha ?? false,
            depth: options?.depth ?? true,
            stencil: options?.stencil ?? false,
            powerPreference: options?.powerPreference ?? 'high-performance',
            premultipliedAlpha: options?.premultipliedAlpha ?? false,
            preserveDrawingBuffer: options?.preserveDrawingBuffer ?? false,
            failIfMajorPerformanceCaveat: options?.failIfMajorPerformanceCaveat ?? false,
        });

        if (gl === null) throw new Error('WebGL2 is not supported');

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 255);
        setGL(gl);
    }, [canvasRef]);

    return (
        <context.Provider
            value={{
                gl,
                setGL,
                canvasRef,
                shaders,
                setShaders,
            }}
        >
            {props.children}
        </context.Provider>
    );
};
