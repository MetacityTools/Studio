import React from 'react';

import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { SnapVerticesWidget } from './Widgets/SnapVertices';
import { SplitModelWidget } from './Widgets/SplitModel';
import { ModelTransformationWidget } from './Widgets/Transformation';

interface ModelDetialProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    model: EditorModel;
    selection: GL.SelectionManager;
}

export function ModelDetailPanel(props: ModelDetialProps) {
    const { scene, renderer, model, selection } = props;

    return (
        <div className="p-4 space-y-4">
            <ModelTransformationWidget model={model} renderer={renderer} />
            <SnapVerticesWidget model={model} />
            <SplitModelWidget model={model} scene={scene} selection={selection} />
        </div>
    );
}
