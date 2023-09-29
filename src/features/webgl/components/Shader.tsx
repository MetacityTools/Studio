import { useEffect } from 'react';

import { useGL } from '@gl/hooks/useGL';
import { useRenderableShader } from '@gl/hooks/useRenderable';
import { useShaders } from '@gl/hooks/useShaders';

type ShaderProps = {
    vs: string;
    fs: string;
    transparent?: boolean;
    depth?: boolean;
};

export const Shader = (props: ShaderProps) => {
    const { vs, fs, transparent = false, depth = true } = props;
    const [, setShader] = useRenderableShader();
    const shader = useShaders(vs, fs, transparent, depth);
    const [gl, setGL] = useGL();

    //We do not dispose unused shaders because if the same shader is used by multiple renderables
    //it will be kept in the catalog only once and disposed with the entire context
    useEffect(() => {
        if (!shader) return;
        setShader(shader);
    }, [shader]);

    return null;
};
