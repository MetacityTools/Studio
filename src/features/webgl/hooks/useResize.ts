import { useContext } from 'react';

import { context } from '@gl/context/GLContext';

export const useResize = () => {
    const ctx = useContext(context);
    return [ctx.size, ctx.setSize] as const;
};
