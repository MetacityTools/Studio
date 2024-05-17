import React from 'react';

import { EditorModel } from '@data/EditorModel';

import { context } from '@context/ViewContext';

export function useClearStyle() {
    const ctx = React.useContext(context);

    const clearStyle = () => {
        ctx.setUsedStyle(null);
        whiten(ctx.models);
    };

    return clearStyle;
}

function whiten(models: EditorModel[]) {
    models.forEach((model) => {
        model.whiten();
        model.uniforms['uUseShading'] = 1;
    });
}
