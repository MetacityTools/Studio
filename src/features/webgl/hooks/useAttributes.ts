import { useContext } from 'react';

import { context } from '@gl/components/Geometry';

export const useAttributes = () => {
    const ctx = useContext(context);
    return [ctx.attributes, ctx.setAttributes] as const;
};
