import { useContext } from 'react';

import { context } from '@gl/context/Renderable';

export const useRenderableGeometry = () => {
    const ctx = useContext(context);
    return [ctx.geometry, ctx.setGeometry] as const;
};

export const useRenderableShader = () => {
    const ctx = useContext(context);
    return [ctx.shader, ctx.setShader] as const;
};
