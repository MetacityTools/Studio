import { context } from '@context/ViewContext';
import React from 'react';

export function useRenderer() {
    const ctx = React.useContext(context);
    return ctx.renderer;
}
