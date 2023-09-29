import { useContext } from 'react';

import { context } from '@gl/context/GLContext';

export const useGL = () => {
    const ctx = useContext(context);
    return [ctx.gl, ctx.setGL] as const;
};
