import React from 'react';

import { context } from '@context/ViewContext';

export function useKeymap() {
    const ctx = React.useContext(context);
    return ctx.renderer.controls?.keyboard.keyMap;
}
