import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { gridModel } from '@utils/geometry/gridModel';

import * as GL from '@bananagl/bananagl';

import { Controls } from './Controls';
import { EditorMenu } from './Menu';

export function ModelEditor() {
    const [renderer, setRenderer] = React.useState(new GL.Renderer());
    const [scene, setScene] = React.useState(new GL.Scene());

    React.useEffect(() => {
        const grid = gridModel();
        scene.add(grid);
        renderer.clearColor = [1, 1, 1, 1];
    }, [scene]);

    return (
        <Allotment>
            <Allotment.Pane minSize={200}>
                <EditorMenu scene={scene} renderer={renderer} />
                <GL.Canvas renderer={renderer} className="w-full h-full">
                    <GL.View scene={scene} left={0} top={0} width={100} height={100} />
                </GL.Canvas>
                <GL.Profiler scenes={[scene]} />
            </Allotment.Pane>
            <Allotment.Pane minSize={200} preferredSize={400}>
                <Controls scene={scene} />
            </Allotment.Pane>
        </Allotment>
    );
}
