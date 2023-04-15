import React from 'react';

import * as GL from '@bananagl/bananagl';

import { ModelControls } from './ControlsModel';

export interface ControlsProps {
    scene: GL.Scene;
}

export function Controls(props: ControlsProps) {
    const { scene } = props;
    const [models, setModels] = React.useState<GL.Renderable[]>([]);

    React.useEffect(() => {
        scene.onChange = () => setModels(scene.objects.slice());
    }, [scene]);

    return (
        <div className="text-xs bg-neutral-100 w-full h-full shadow-inner">
            {models
                .filter((model) => model.data.imported)
                .map((model, index) => (
                    <ModelControls key={index} model={model} />
                ))}
        </div>
    );
}
