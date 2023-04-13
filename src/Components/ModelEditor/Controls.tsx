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
        <div className="absolute top-0 right-0 m-4 text-xs rounded-sm bg-neutral-900">
            {models
                .filter((model) => model.data.imported)
                .map((model, index) => (
                    <ModelControls key={index} model={model} />
                ))}
        </div>
    );
}
