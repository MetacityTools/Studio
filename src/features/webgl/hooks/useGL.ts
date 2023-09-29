import { useContext } from 'react';

import { context } from '@gl/components/GLContext';

export const useGL = () => {
    const ctx = useContext(context);
    return [ctx.gl, ctx.setGL] as const;
};
