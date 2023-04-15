import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { gridModel } from '@utils/geometry/gridModel';

import * as GL from '@bananagl/bananagl';

import { SizeGuard } from '@elements/SizeGuard';

import { Controls } from './Controls';
import { EditorMenu } from './EditorMenu';

export function ModelEditor() {
    const [renderer, setRenderer] = React.useState(new GL.Renderer());
    const [scene, setScene] = React.useState(new GL.Scene());

    React.useEffect(() => {
        const grid = gridModel();
        scene.add(grid);
        renderer.clearColor = [1, 1, 1, 1];
    }, [scene]);

    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <Allotment separator={false}>
                <Allotment.Pane minSize={200} className="bg-white">
                    <GL.Canvas renderer={renderer} className="w-full h-full">
                        <GL.View scene={scene} left={0} top={0} width={100} height={100} />
                    </GL.Canvas>
                    <EditorMenu scene={scene} renderer={renderer} view={0} />
                </Allotment.Pane>
                <Allotment.Pane minSize={200} preferredSize={400}>
                    <Controls scene={scene} renderer={renderer} />
                </Allotment.Pane>
            </Allotment>
        </SizeGuard>
    );
}
