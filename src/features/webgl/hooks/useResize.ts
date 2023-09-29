import { useContext } from 'react';

import { context } from '@gl/components/Canvas';

export const useResize = () => {
    const ctx = useContext(context);
    return [ctx.size, ctx.setSize] as const;
};
