import clsx from 'clsx';
import React from 'react';
import { BrickFace, BrickModel } from 'types';

import { isValidFace, isValidModel, parseFace } from './parser';

const initialCubeBrick: BrickModel = [
    [
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],
    [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 1],
        [0, 0, 1],
    ],
    [
        [0, 0, 0],
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1],
        [1, 0, 1],
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 1, 1],
        [0, 1, 1],
    ],
    [
        [0, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 1],
    ],
];

const initialSlopedBrick: BrickModel = [
    [
        [0, 0, 0],
        [3, 0, 0],
        [3, 2, 0],
        [0, 2, 0],
    ],
    [
        [0, 0, 0],
        [3, 0, 1],
        [3, 2, 1],
        [0, 2, 0],
    ],
    [
        [0, 0, 0],
        [3, 0, 0],
        [3, 0, 1],
    ],
    [
        [0, 2, 0],
        [3, 2, 0],
        [3, 2, 1],
    ],
    [
        [3, 0, 0],
        [3, 2, 0],
        [3, 2, 1],
        [3, 0, 1],
    ],
];

interface ModelRendererProps {
    model?: BrickModel;
}

function SVGOutput(points: number[][][], grid = false) {
    const flat = points.flat();
    const minX = Math.min(...flat.map((point) => point[0]));
    const minY = Math.min(...flat.map((point) => point[1]));
    const maxX = Math.max(...flat.map((point) => point[0]));
    const maxY = Math.max(...flat.map((point) => point[1]));

    const gridLines = [];
    if (grid) {
        for (let x = minX - 2; x <= maxX + 2; x++) {
            gridLines.push(
                <line
                    key={`x${x}`}
                    x1={x}
                    y1={minY - 2}
                    x2={x}
                    y2={maxY + 2}
                    stroke="white"
                    strokeWidth="0.005"
                    strokeDasharray="0.01,0.01"
                />
            );
        }
        for (let y = minY - 2; y <= maxY + 2; y++) {
            gridLines.push(
                <line
                    key={`y${y}`}
                    x1={minX - 2}
                    y1={y}
                    x2={maxX + 2}
                    y2={y}
                    stroke="white"
                    strokeWidth="0.005"
                    strokeDasharray="0.01,0.01"
                />
            );
        }
    }

    return (
        <svg
            viewBox={`${minX - 1} ${minY - 1} ${maxX - minX + 2} ${maxY - minY + 2}`}
            //transform to make y axis go upwards
            transform="scale(1, -1)"
        >
            {points.map((face, index) => (
                <polygon
                    key={index}
                    points={face.map((point) => point.join(',')).join(' ')}
                    fill="rgba(255, 255, 255, 0.05)"
                    stroke="white"
                    strokeWidth="0.01"
                />
            ))}
            {gridLines}
        </svg>
    );
}

function ModelTopView(props: ModelRendererProps) {
    const { model } = props;
    if (model) {
        const points = model.map((face) => face.map((point) => point.slice(0, 2))) ?? [];
        return SVGOutput(points, true);
    } else {
        return <div>no model</div>;
    }
}

function ModelSideViewXZ(props: ModelRendererProps) {
    const { model } = props;
    if (model) {
        const points = model.map((face) => face.map((point) => [point[0], point[2]])) ?? [];
        return SVGOutput(points, true);
    } else {
        return <div>no model</div>;
    }
}

function ModelSideViewYZ(props: ModelRendererProps) {
    const { model } = props;
    if (model) {
        const points = model.map((face) => face.map((point) => [point[1], point[2]])) ?? [];
        return SVGOutput(points, true);
    } else {
        return <div>no model</div>;
    }
}

function ModelAxonometryView(props: ModelRendererProps) {
    const { model } = props;
    //Z axis is up
    if (model) {
        const points =
            model.map((face) =>
                face.map((point) => {
                    const x = point[0];
                    const y = point[1];
                    const z = point[2];
                    return [x + y * 0.5, z + y * 0.5];
                })
            ) ?? [];
        return SVGOutput(points);
    } else {
        return <div>no model</div>;
    }
}

export function ModelRenderer(props: ModelRendererProps) {
    const { model } = props;

    return (
        <div className="w-full flex flex-row space-x-2">
            {isValidModel(model) ? (
                <>
                    <ModelAxonometryView model={model} />
                    <ModelTopView model={model} />
                    <ModelSideViewYZ model={model} />
                    <ModelSideViewXZ model={model} />
                </>
            ) : (
                <div className="text-4xl text-neutral-500 m-auto">invalid model</div>
            )}
        </div>
    );
}

interface FaceEditorProps {
    face: BrickFace;
    updateFace: (face: BrickFace) => void;
}

function FaceEditor(props: FaceEditorProps) {
    const { face, updateFace } = props;
    return (
        <input
            className={clsx(
                'block w-[40rem] mb-2 py-2 px-4 font-mono text-xl',
                isValidFace(face) ? 'bg-neutral-700' : 'bg-red-500/25'
            )}
            onChange={(event) => {
                const newFace = event.target.value;
                const face = parseFace(newFace, '/');
                updateFace(face);
            }}
            defaultValue={face.map((point) => point.join(' ')).join(' / ')}
        />
    );
}

interface ModelEditorProps {
    model?: BrickModel;
    setModel: (model: BrickModel) => void;
}

export function ModelEditor(props: ModelEditorProps) {
    const { model, setModel } = props;
    const modelCopy = model ? [...model.filter((face) => face.length > 0), []] : [];

    const updateFace = (face: BrickFace, index: number) => {
        if (!model) {
            return;
        }
        modelCopy[index] = face;
        const copy = modelCopy.slice();
        //remove empty faces at the end
        while (copy.length > 0 && copy[copy.length - 1].length === 0) copy.pop();
        setModel(copy);
    };

    return (
        <div className="p-4">
            {modelCopy.map((face, index) => (
                <FaceEditor
                    key={index}
                    face={face}
                    updateFace={(face: BrickFace) => updateFace(face, index)}
                />
            ))}
        </div>
    );
}

interface ModelRowProps {
    model: BrickModel;
    updateModel: (model: BrickModel) => void;
}

export function ModelRow(props: ModelRowProps) {
    const [model, setModel] = React.useState<BrickModel>(
        props.model.length > 0 ? props.model : initialCubeBrick
    );

    React.useEffect(() => {
        if (model) props.updateModel(model);
    }, [model]);

    return (
        <div className="flex flex-row">
            <ModelEditor model={model} setModel={setModel} />
            <ModelRenderer model={model} />
        </div>
    );
}

export function BrickEditor() {
    const [models, setModels] = React.useState<BrickModel[]>([]);

    const updateModel = (model: BrickModel, index: number) => {
        const copy = models.slice();
        copy[index] = model;
        setModels(copy);
    };

    const addModel = () => {
        setModels([...models, []]);
    };

    const removeModel = (index: number) => {
        const copy = models.slice();
        copy.splice(index, 1);
        setModels(copy);
    };

    const exportModels = () => {
        //export models to json
        const json = JSON.stringify(models);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'models.json';
        link.click();
        link.remove();
    };

    const importModels = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const input = event.currentTarget.elements.namedItem('model') as HTMLInputElement;
        if (input.files) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const json = event.target?.result;
                if (json) {
                    const models = JSON.parse(json as string);
                    setModels(models);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div>
            <form onSubmit={importModels}>
                <label htmlFor="model">Model</label>
                <input type="file" id="model" name="model" multiple={true} />
                <input type="submit" value="Submit" />
            </form>
            {models.map((model, index) => (
                <div key={index}>
                    <div className="p-4">
                        <button onClick={() => removeModel(index)}>remove model</button>
                    </div>

                    <ModelRow model={model} updateModel={(model) => updateModel(model, index)} />
                </div>
            ))}
            <button onClick={addModel}>add model</button>
            <button onClick={exportModels}>export models</button>
        </div>
    );
}
