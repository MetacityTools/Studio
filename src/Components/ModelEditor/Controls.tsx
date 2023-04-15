import React from 'react';

import * as GL from '@bananagl/bananagl';

import { ModelControls } from './Controls/ControlsModel';
import { Vitals } from './Controls/Vitals';

export interface ControlsProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
}

export function Controls(props: ControlsProps) {
    const { scene } = props;
    const [models, setModels] = React.useState<GL.Renderable[]>([]);

    React.useEffect(() => {
        scene.onChange = () => setModels(scene.objects.slice());
    }, [scene]);

    return (
        <div className="text-xs bg-neutral-100 w-full h-full">
            <Vitals scenes={[scene]} renderer={props.renderer} />
            <div className="h-[10rem] m-4 rounded-2xl hover:shadow-even bg-white"></div>
            <div className="h-[10rem] m-4 rounded-2xl bg-white"></div>
        </div>
    );
}
