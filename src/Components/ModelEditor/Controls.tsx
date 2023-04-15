import React from 'react';

import * as GL from '@bananagl/bananagl';

import { EmptyDataPanel } from '@elements/Empty';

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
        <div className="text-xs bg-neutral-100 w-full h-full flex flex-col items-start p-4">
            <div className="flex flex-row">
                <button className="py-2 px-4 hover:bg-neutral-200 rounded-md transition-colors">
                    Add Model
                </button>
            </div>
            <EmptyDataPanel />
            <Vitals scenes={[scene]} renderer={props.renderer} />
        </div>
    );
}

//<div className="h-[10rem] m-4 rounded-2xl hover:shadow-even bg-white"></div>
//<div className="h-[10rem] m-4 rounded-2xl bg-white"></div>
