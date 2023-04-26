import { mat4, vec3 } from 'gl-matrix';
import React from 'react';
import { TiArrowMove } from 'react-icons/ti';

import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { DetailWidget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

function VectorComponentInput(props: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) {
    const { label, value, onChange } = props;

    return (
        <div className="flex flex-row items-center bg-white">
            <label className="p-2 text-neutral-400">{label}</label>
            <input
                type="number"
                className="p-2 bg-transparent border-0 text-right focus:outline-none w-24"
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
        <div className="flex flex-row ">
            <VectorComponentInput label="X" value={x} onChange={(v) => onChange([v, y, z])} />
            <VectorComponentInput label="Y" value={y} onChange={(v) => onChange([x, v, z])} />
            <VectorComponentInput label="Z" value={z} onChange={(v) => onChange([x, y, v])} />
        </div>
    );
}

interface ModelControlsProps {
    model: EditorModel;
    renderer: GL.Renderer;
}

export function ModelTransformationWidget(props: ModelControlsProps) {
    const { model, renderer } = props;

    const [position, setPosition] = React.useState(model.position);
    const [rotation, setRotation] = React.useState(model.rotation);
    const [scale, setScale] = React.useState(model.scale);

    const [tmpPosition, setTmpPosition] = React.useState(model.position);
    const [tmpRotation, setTmpRotation] = React.useState(model.rotation);

    const [moveShortcut, setMoveShortcut] = React.useState(new GL.ShortcutOnMouseMove('KeyG'));
    const [scaleShortcut, setScaleShortcut] = React.useState(new GL.ShortcutOnMouseMove('KeyS'));

    React.useEffect(() => {
        renderer.onInit = () => {
            const controls = renderer.window.controls;
            controls.addShortcut(moveShortcut);
            controls.addShortcut(scaleShortcut);
        };

        return () => {
            const controls = renderer.window.controls;
            controls.removeShortcut(moveShortcut);
            controls.removeShortcut(scaleShortcut);
        };
    }, [renderer]);

    React.useEffect(() => {
        moveShortcut.onTrigger = (view, dx, dy) => {
            const dir = view.camera.cameraPlaneVector(dx, dy);
            setPosition((p) => vec3.add(p, p, dir).slice() as vec3);
        };

        moveShortcut.onStartCall = () => {
            setTmpPosition(position.slice() as vec3);
        };

        moveShortcut.onCancelCall = () => {
            setPosition(tmpPosition.slice() as vec3);
        };

        scaleShortcut.onTrigger = (view, dx, dy) => {
            console.log(dx);
            let fact = dx > 0 ? 1.01 : 1;
            fact = dx < 0 ? 0.99 : fact;
            setScale((s) => vec3.scale(s, s, fact).slice() as vec3);
        };

        scaleShortcut.onStartCall = () => {
            setTmpRotation(rotation.slice() as vec3);
        };

        scaleShortcut.onCancelCall = () => {
            setRotation(tmpRotation.slice() as vec3);
        };
    }, [model]);

    React.useEffect(() => {
        setPosition(model.position);
        setRotation(model.rotation);
        setScale(model.scale);
    }, [model]);

    React.useEffect(() => {
        if (position.some((v) => isNaN(v))) return;
        model.position = position;
    }, [position]);

    React.useEffect(() => {
        if (rotation.some((v) => isNaN(v))) return;
        model.rotation = rotation;
    }, [rotation]);

    React.useEffect(() => {
        if (scale.some((v) => isNaN(v))) return;
        model.scale = scale;
    }, [scale]);

    return (
        <DetailWidget>
            <WidgetLine>
                <WidgetTitle>
                    <TiArrowMove className="mr-2" />
                    Transform Model
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Shift, Scale and Rotate the model</WidgetDescription>
            </WidgetLine>
            <WidgetLine>
                <div className="p-2 flex-1">Shift</div>
                <VectorControls value={position} onChange={setPosition} />
            </WidgetLine>
            <WidgetLine>
                <div className="p-2 flex-1">Rotate</div>
                <VectorControls value={rotation} onChange={setRotation} />
            </WidgetLine>
            <WidgetLine>
                <div className="p-2 flex-1">Scale</div>
                <VectorControls value={scale} onChange={setScale} />
            </WidgetLine>
        </DetailWidget>
    );
}
