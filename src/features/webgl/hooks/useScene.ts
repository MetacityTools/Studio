import { useContext } from 'react';

import { context } from '@gl/context/Scene';

export const useScene = () => {
    const ctx = useContext(context);
    return [ctx.renderables, ctx.setRenderables] as const;
};
