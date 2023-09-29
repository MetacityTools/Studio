import { SHA256 } from 'crypto-js';
import { useEffect, useMemo } from 'react';

import { useGL } from '@gl/hooks/useGL';
import { useRenderableShader } from '@gl/hooks/useRenderable';
import { useShaderCatalog } from '@gl/hooks/useShaderCatalog';
import { Shader as ShaderClass } from '@gl/runtime/shader';

type ShaderProps = {
    vs: string;
    fs: string;
    transparent?: boolean;
    depth?: boolean;
};

const ShaderKey = (vs: string, fs: string, transparent: boolean, depth: boolean) => {
    return `${SHA256(vs)}-${SHA256(fs)}-${transparent}-${depth}`;
};

export const Shader = (props: ShaderProps) => {
    const { vs, fs, transparent = false, depth = true } = props;
    const [shaderCatalog, setShaderCatalog] = useShaderCatalog();
    //create an unique key for shader code and parameters
    const key = useMemo(() => ShaderKey(vs, fs, transparent, depth), [vs, fs, transparent, depth]);
    //access the shader from the renderable
    const [shader, setShader] = useRenderableShader();
    const [gl, setGL] = useGL();

    //We do not dispose unused shaders because if the same shader is used by multiple renderables
    //it will be kept in the catalog only once and disposed with the entire context
    useEffect(() => {
        setShaderCatalog((prev) => {
            const catalog = new Map(prev);
            if (catalog.has(key)) return prev;
            const shader = new ShaderClass(vs, fs, transparent, depth);
            catalog.set(key, shader);
            return catalog;
        });
    }, [vs, fs, transparent, depth]);

    useEffect(() => {
        const shader = shaderCatalog.get(key);
        if (!shader) return;
        setShader(shader);
    }, [shaderCatalog]);

    return null;
};
