import { useContext } from 'react';

import { context } from '@gl/context/GLContext';

export const useShaderCatalog = () => {
    const ctx = useContext(context);
    return [ctx.shaderCatalog, ctx.setShaderCatalog] as const;
};
