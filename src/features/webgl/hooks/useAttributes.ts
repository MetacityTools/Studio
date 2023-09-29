import { useContext } from 'react';

import { context } from '@gl/context/Geometry';

export const useAttributes = () => {
    const ctx = useContext(context);
    return [ctx.attributes, ctx.setAttributes] as const;
};
