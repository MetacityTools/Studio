import { createContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { useGL } from '@gl/hooks/useGL';
import { useScene } from '@gl/hooks/useScene';
import { Geometry } from '@gl/runtime/geometry';
import { Renderable as RenderableClass } from '@gl/runtime/renderable';
import { Shader } from '@gl/runtime/shader';

interface SceneProviderProps {
    geometry: Geometry | null;
    setGeometry: React.Dispatch<React.SetStateAction<Geometry | null>>;
    shader: Shader | null;
    setShader: React.Dispatch<React.SetStateAction<Shader | null>>;
}

export const context = createContext<SceneProviderProps>({} as SceneProviderProps);

type RenderableProps = {
    children: React.ReactNode;
};

export const Renderable = (props: RenderableProps) => {
    const { children } = props;
    const [id] = useState<string>(v4());
    const [renderables, setRenderables] = useScene();
    const [geometry, setGeometry] = useState<Geometry | null>(null);
    const [shader, setShader] = useState<Shader | null>(null);
    const [gl] = useGL();

    useEffect(() => {
        return () => {
            setRenderables((prev) => {
                const copy = new Map(prev);
                const prevObject = copy.get(id);
                if (prevObject) prevObject.dispose(gl);
                copy.delete(id);
                return copy;
            });
        };
    }, []);

    useEffect(() => {
        if (geometry && shader) {
            setRenderables((prev) => {
                const copy = new Map(prev);
                const prevObject = copy.get(id);
                if (prevObject) prevObject.dispose(gl);
                copy.set(id, new RenderableClass(geometry, shader));
                return copy;
            });
        }
    }, [geometry, shader]);

    return (
        <context.Provider
            value={{
                geometry,
                setGeometry,
                shader,
                setShader,
            }}
        >
            {children}
        </context.Provider>
    );
};
