import React from 'react';
import { TbLayersDifference, TbRulerMeasure } from 'react-icons/tb';

import { EditorModel } from '@utils/models/EditorModel';
import { snapVertices } from '@utils/transforms/vertexSnap';

import * as GL from '@bananagl/bananagl';

function DetailWidget(props: { children?: React.ReactNode }) {
    return <div className="flex flex-col bg-neutral-200 rounded-md">{props.children}</div>;
}

function WidgetLine(props: { children?: React.ReactNode }) {
    return <div className="flex flex-row items-center w-full text-base">{props.children}</div>;
}

function WidgetTitle(props: { children?: React.ReactNode }) {
    return (
        <div className="py-2 px-4 w-full text-neutral-500 flex flex-row items-center">
            {props.children}
        </div>
    );
}

function WidgetDescription(props: { children?: React.ReactNode }) {
    return <div className="py-2 px-4 w-full text-neutral-500 text-xs">{props.children}</div>;
}

function WidgetApplyButton(props: { onApply: () => void }) {
    const { onApply } = props;
    return (
        <button
            className="py-2 px-4 hover:bg-neutral-300 rounded-tr-md transition-colors cursor-pointer font-heavy"
            onClick={onApply}
        >
            Apply
        </button>
    );
}

interface ModelDetialProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    model: EditorModel;
    selection: GL.SelectionManager;
}

export function ModelDetailPanel(props: ModelDetialProps) {
    const { scene, renderer, model } = props;
    const [snapDistance, setSnapDistance] = React.useState(0.1);
    const [selectionModelName, setSelectionModelName] = React.useState('');

    const applySnap = () => {
        snapVertices(model, snapDistance);
    };

    const updateSnapValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const i = parseFloat(e.target.value);
        if (isNaN(i)) return;
        else setSnapDistance(i);
    };

    const splitModel = () => {
        console.log('splitting model');
    };

    return (
        <div className="p-4 space-y-4">
            <DetailWidget>
                <WidgetLine>
                    <WidgetTitle>
                        <TbRulerMeasure className="mr-2" />
                        Snap Vertices
                    </WidgetTitle>
                    <WidgetApplyButton onApply={applySnap} />
                </WidgetLine>
                <WidgetLine>
                    <WidgetDescription>
                        Snap vertices that are within the specified distance to each other.
                    </WidgetDescription>
                </WidgetLine>
                <WidgetLine>
                    <div className="py-2 px-4">Distance</div>
                    <input
                        type="number"
                        className="py-2 px-4 text-right flex-1 rounded-br-md"
                        step={0.1}
                        defaultValue={snapDistance}
                        onChange={updateSnapValue}
                    />
                </WidgetLine>
            </DetailWidget>
            <DetailWidget>
                <WidgetLine>
                    <WidgetTitle>
                        <TbLayersDifference className="mr-2" />
                        Split Model
                    </WidgetTitle>
                    <WidgetApplyButton onApply={splitModel} />
                </WidgetLine>
                <WidgetLine>
                    <WidgetDescription>
                        Split the model based on the current selection, the selected parts will be
                        removed from the original model and placed into a new model.
                    </WidgetDescription>
                </WidgetLine>
                <WidgetLine>
                    <div className="py-2 px-4">Split Model Name</div>
                    <input
                        type="string"
                        className="py-2 px-4 text-right flex-1 rounded-br-md"
                        step={0.1}
                        defaultValue={selectionModelName}
                        onChange={(e) => setSelectionModelName(e.target.value)}
                    />
                </WidgetLine>
            </DetailWidget>
            <DetailWidget>TODO more</DetailWidget>
        </div>
    );
}
