import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { GridModel } from '@utils/models/GridModel';

import * as GL from '@bananagl/bananagl';

import { SizeGuard } from '@elements/SizeGuard';

import { ControlPanel } from './ControlPanel';
import { EditorMenu } from './EditorMenu';

export function ModelEditor() {
    const [renderer, setRenderer] = React.useState(new GL.Renderer());
    const [scene, setScene] = React.useState(new GL.Scene());
    const [selection, setSelection] = React.useState<GL.SelectionManager>(
        new GL.SelectionManager()
    );

    React.useEffect(() => {
        const grid = GridModel();
        scene.add(grid);
        renderer.clearColor = [1, 1, 1, 1];
    }, [scene]);

    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <Allotment separator={false}>
                <Allotment.Pane minSize={200} className="bg-white">
                    <EditorMenu scene={scene} renderer={renderer} view={0} />
                    <GL.Canvas renderer={renderer} className="w-full h-full">
                        <GL.View scene={scene} left={0} top={0} width={100} height={100} />
                    </GL.Canvas>
                </Allotment.Pane>
                <Allotment.Pane minSize={200} preferredSize={400}>
                    <ControlPanel scene={scene} renderer={renderer} selection={selection} />
                </Allotment.Pane>
            </Allotment>
        </SizeGuard>
    );
}
