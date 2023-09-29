import { useContext } from 'react';

import { context } from '@gl/context/GLContext';

export const useCanvasRef = () => {
    const ctx = useContext(context);
    return ctx.canvasRef;
};
