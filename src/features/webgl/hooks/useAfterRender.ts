import { useContext } from 'react';

import { context } from '@gl/context/Scene';

export const useAfterRender = () => {
    const ctx = useContext(context);

    const addAfterRenderCallback = (callback: () => void) => {
        ctx.afterRenderCallbacks?.current?.push(callback);
    };

    return addAfterRenderCallback;
};
