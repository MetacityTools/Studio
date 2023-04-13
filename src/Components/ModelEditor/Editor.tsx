import React from 'react';

import { gridModel } from '@utils/geometry/gridModel';

import * as GL from '@bananagl/bananagl';

import { Container } from '@elements/Container';

import { Controls } from './Controls';
import { EditorMenu } from './Menu';

export function ModelEditor() {
    const [renderer, setRenderer] = React.useState(new GL.Renderer());
    const [scene, setScene] = React.useState(new GL.Scene());

    React.useEffect(() => {
        const grid = gridModel();
        scene.add(grid);
    }, [scene]);

    return (
        <Container full className="h-full">
            <EditorMenu scene={scene} renderer={renderer} />
            <Controls scene={scene} />
            <GL.Canvas renderer={renderer} className="w-full h-full">
                <GL.View scene={scene} left={0} top={0} width={100} height={100} />
            </GL.Canvas>
            <GL.Profiler scenes={[scene]} />
        </Container>
    );
}
