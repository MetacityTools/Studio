import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

interface ModelDetialProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    model: EditorModel;
}

export function ModelDetailPanel(props: ModelDetialProps) {
    const { scene, renderer, model } = props;
    return null;
}
