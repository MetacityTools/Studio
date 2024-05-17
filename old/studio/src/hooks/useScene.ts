import { context } from '@context/ViewContext';
import React from 'react';

export function useScene() {
    const ctx = React.useContext(context);
    return ctx.scene;
}
