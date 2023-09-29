import { SHA256 } from 'crypto-js';
import { useContext, useMemo } from 'react';

import { context } from '@gl/components/GLContext';
import { Shader } from '@gl/runtime/shader';

const ShaderKey = (vs: string, fs: string, transparent: boolean, depth: boolean) => {
    return `${SHA256(vs)}-${SHA256(fs)}-${transparent}-${depth}`;
};

export const useShaders = (vs: string, fs: string, transparent: boolean, depth: boolean) => {
    const ctx = useContext(context);
    const key = useMemo(() => ShaderKey(vs, fs, transparent, depth), [vs, fs, transparent, depth]);
    const shader = useMemo(() => {
        if (ctx.shaders.has(key)) return ctx.shaders.get(key);
        const shader = new Shader(vs, fs, transparent, depth);
        ctx.shaders.set(key, shader);
        return shader;
    }, [ctx.shaders, key, vs, fs, transparent, depth]);

    return shader;
};
