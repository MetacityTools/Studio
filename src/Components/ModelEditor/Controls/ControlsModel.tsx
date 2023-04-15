import { mat4, vec3 } from 'gl-matrix';
import React from 'react';

import * as GL from '@bananagl/bananagl';

function VectorComponentInput(props: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) {
    const { label, value, onChange } = props;

    return (
        <div className="flex flex-row items-center bg-neutral-800">
            <label className="p-2 text-neutral-400">{label}</label>
            <input
                type="number"
                className="p-2 bg-transparent border-0 text-neutral-100 focus:outline-none w-24"
                value={isNaN(value) ? '' : value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </div>
    );
}

interface VectorControlsProps {
    value: vec3;
    onChange: (value: vec3) => void;
}

function VectorControls(props: VectorControlsProps) {
    const { value, onChange } = props;
    const [x, y, z] = value;

    return (
        <div className="flex flex-row">
            <VectorComponentInput label="X" value={x} onChange={(v) => onChange([v, y, z])} />
            <VectorComponentInput label="Y" value={y} onChange={(v) => onChange([x, v, z])} />
            <VectorComponentInput label="Z" value={z} onChange={(v) => onChange([x, y, v])} />
        </div>
    );
}

interface ModelControlsProps {
    model: GL.Renderable;
}

export function ModelControls(props: ModelControlsProps) {
    const { model } = props;
    const [position, setPosition] = React.useState(vec3.create());
    const [rotation, setRotation] = React.useState(vec3.create());
    const [scale, setScale] = React.useState(vec3.fromValues(1, 1, 1));

    const updateMatrix = () => {
        mat4.identity(model.transform);
        mat4.translate(model.transform, model.transform, position);
        mat4.rotateX(model.transform, model.transform, (rotation[0] / 180) * Math.PI);
        mat4.rotateY(model.transform, model.transform, (rotation[1] / 180) * Math.PI);
        mat4.rotateZ(model.transform, model.transform, (rotation[2] / 180) * Math.PI);
        mat4.scale(model.transform, model.transform, scale);
    };

    React.useEffect(() => {
        if (position.some((v) => isNaN(v))) return;
        if (rotation.some((v) => isNaN(v))) return;
        if (scale.some((v) => isNaN(v))) return;
        updateMatrix();
    }, [position, rotation, scale]);

    return (
        <div className="flex flex-col items-start border-b last:border-b-0 border-neutral-800">
            <div className="p-2">
                <span className="text-neutral-400">Model:</span> {model.data.name}
            </div>
            <div className="flex flex-row">
                <div className="p-2 w-16">Shift</div>
                <VectorControls value={position} onChange={setPosition} />
            </div>
            <div className="flex flex-row">
                <div className="p-2 w-16">Rotate</div>
                <VectorControls value={rotation} onChange={setRotation} />
            </div>
            <div className="flex flex-row">
                <div className="p-2 w-16">Scale</div>
                <VectorControls value={scale} onChange={setScale} />
            </div>
        </div>
    );
}
