import { vec3 } from 'gl-matrix';
import React from 'react';
import { TiArrowMove } from 'react-icons/ti';

import { useRenderer, useSelection } from '@utils/utils';

import * as GL from '@bananagl/bananagl';

import { Input } from '@elements/Input';
import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

function VectorComponentInput(props: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) {
    const { label, value, onChange } = props;

    return (
        <td className="bg-white">
            <Input
                type="number"
                className="p-2 bg-transparent border-0 text-right focus:outline-none w-full"
                value={isNaN(value) ? '' : value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </td>
    );
}

interface VectorControlsProps {
    title: string;
    value: vec3;
    onChange: (value: vec3) => void;
}

function VectorControls(props: VectorControlsProps) {
    const { value, onChange } = props;
    const [x, y, z] = value;

    return (
        <tr>
            <td className="py-2 px-4 text-neutral-400">{props.title}</td>
            <VectorComponentInput label="X" value={x} onChange={(v) => onChange([v, y, z])} />
            <VectorComponentInput label="Y" value={y} onChange={(v) => onChange([x, v, z])} />
            <VectorComponentInput label="Z" value={z} onChange={(v) => onChange([x, y, v])} />
        </tr>
    );
}

export function ModelTransformationWidget() {
    const renderer = useRenderer();
    const [, selectedModel] = useSelection();

    if (selectedModel === null) return null;
    const model = selectedModel;

    const [position, setPosition] = React.useState(model.position);
    const [rotation, setRotation] = React.useState(model.rotation);
    const [scale, setScale] = React.useState(model.scale);

    const [moveShortcut] = React.useState(new GL.ShortcutOnMouseMove<vec3>('KeyG'));
    const [scaleShortcut] = React.useState(new GL.ShortcutOnMouseMove<vec3>('KeyS'));

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
            moveShortcut.storage = model.position.slice() as vec3;
        };

        moveShortcut.onCancelCall = (data) => {
            if (data) setPosition(data.slice() as vec3);
        };

        scaleShortcut.onTrigger = (view, dx, dy) => {
            let fact = dx > 0 ? 1.01 : 1;
            fact = dx < 0 ? 0.99 : fact;
            setScale((s) => vec3.scale(s, s, fact).slice() as vec3);
        };

        scaleShortcut.onStartCall = () => {
            scaleShortcut.storage = model.scale.slice() as vec3;
        };

        scaleShortcut.onCancelCall = (data) => {
            if (data) setScale(data.slice() as vec3);
        };
    }, [model, moveShortcut, scaleShortcut]);

    React.useEffect(() => {
        setPosition(model.position);
        setRotation(model.rotation);
        setScale(model.scale);
    }, [model]);

    React.useEffect(() => {
        if (position.some((v) => isNaN(v))) return;
        model.position = position;
    }, [position, model]);

    React.useEffect(() => {
        if (rotation.some((v) => isNaN(v))) return;
        model.rotation = rotation;
    }, [rotation, model]);

    React.useEffect(() => {
        if (scale.some((v) => isNaN(v))) return;
        model.scale = scale;
    }, [scale, model]);

    return (
        <Widget>
            <WidgetLine>
                <WidgetTitle>
                    <TiArrowMove className="mr-2" />
                    Transform Model
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Shift, Scale and Rotate the model</WidgetDescription>
            </WidgetLine>
            <table className="table-auto">
                <tbody>
                    <VectorControls title="Shift" value={position} onChange={setPosition} />
                    <VectorControls title="Rotate" value={rotation} onChange={setRotation} />
                    <VectorControls title="Scale" value={scale} onChange={setScale} />
                </tbody>
            </table>
        </Widget>
    );
}
