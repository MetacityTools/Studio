import clsx from 'clsx';
import React, { ReactElement } from 'react';
import { Brick, BrickFace, BrickModel } from 'types';

import { Container } from '@components/Elements/Container';

import { isValidFace, parseFace, serializeModel } from './parser';

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

function SVGOutput(points: number[][][], grid = false, xAxis = 'x', yAxis = 'y') {
    const flat = points.flat();
    flat.forEach((point, index) => {
        point[1] = -point[1];
    });
    const minX = Math.min(...flat.map((point) => point[0]));
    const minY = Math.min(...flat.map((point) => point[1]));
    const maxX = Math.max(...flat.map((point) => point[0]));
    const maxY = Math.max(...flat.map((point) => point[1]));

    const gridLines = [];
    const gridPointsCoordinates = [];
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

        for (let x = minX - 2; x <= maxX + 2; x++) {
            for (let y = minY - 2; y <= maxY + 2; y++) {
                gridPointsCoordinates.push(
                    <text
                        key={`x${x}y${y}`}
                        x={x + 0.05}
                        y={y - 0.05}
                        fill="white"
                        fontSize="0.1"
                        textAnchor="left"
                        dominantBaseline="bottom"
                    >
                        {x}
                        {xAxis}
                        {-y}
                        {yAxis}
                    </text>
                );
            }
        }
    }

    return (
        <svg
            className="w-full bg-neutral-700 rounded-sm"
            viewBox={`${minX - 0.5} ${minY - 0.5} ${maxX - minX + 1} ${maxY - minY + 1}`}
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
            {gridPointsCoordinates}
        </svg>
    );
}

function ModelTopView(props: ModelRendererProps) {
    const { model } = props;
    if (model) {
        const points = model.map((face) => face.map((point) => point.slice(0, 2))) ?? [];
        return SVGOutput(points, true, 'x', 'y');
    } else {
        return <div>no model</div>;
    }
}

function ModelSideViewXZ(props: ModelRendererProps) {
    const { model } = props;
    if (model) {
        const points = model.map((face) => face.map((point) => [point[0], point[2]])) ?? [];
        return SVGOutput(points, true, 'x', 'z');
    } else {
        return <div>no model</div>;
    }
}

function ModelSideViewYZ(props: ModelRendererProps) {
    const { model } = props;
    if (model) {
        const points = model.map((face) => face.map((point) => [point[1], point[2]])) ?? [];
        return SVGOutput(points, true, 'y', 'z');
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
    if (!model) return <div className="text-4xl text-neutral-500 m-auto">invalid model</div>;
    const validModel = model.filter((face) => isValidFace(face));
    return (
        <div className="relative ml-2">
            <div className="w-full flex flex-row space-x-2 mb-2">
                <ModelAxonometryView model={validModel} />
                <ModelTopView model={validModel} />
            </div>
            <div className="w-full flex flex-row space-x-2">
                <ModelSideViewYZ model={validModel} />
                <ModelSideViewXZ model={validModel} />
            </div>
        </div>
    );
}

interface FaceEditorProps {
    repr: string;
    face: BrickFace;
    updateFace: (repr: string, face: BrickFace) => void;
}

function FaceEditor(props: FaceEditorProps) {
    const { repr, face, updateFace } = props;

    //TODO add timeout so it doesn't redraw all the time

    return (
        <input
            className={clsx(
                'block w-[40rem] mb-2 py-2 px-4 font-mono text-xl rounded-sm',
                isValidFace(face) ? 'bg-neutral-700' : 'bg-red-500/25'
            )}
            onChange={(event) => {
                const repr = event.target.value;
                const face = parseFace(repr, '/');
                updateFace(repr, face);
            }}
            value={repr}
        />
    );
}

interface BrickEditorProps {
    brick: Brick;
    setBrick: (model: Brick) => void;
}

export function BrickEditor(props: BrickEditorProps) {
    const { brick, setBrick } = props;
    const model = brick.model;
    const repr = brick.repr;
    const copy = model ? [...model.filter((face) => face.length > 0), []] : [];

    const updateFace = (repr: string, face: BrickFace, index: number) => {
        brick.model[index] = face;
        brick.repr[index] = repr;
        //remove empty faces at the end
        while (brick.model.length > 0 && brick.model[brick.model.length - 1].length === 0) {
            brick.model.pop();
            brick.repr.pop();
        }
        setBrick(brick);
    };

    return (
        <div>
            {copy.map((face, index) => (
                <FaceEditor
                    key={index}
                    face={face}
                    repr={repr[index]}
                    updateFace={(repr: string, face: BrickFace) => updateFace(repr, face, index)}
                />
            ))}
        </div>
    );
}

interface BrickRowProps {
    brick: Brick;
    index: number;
    updateBrick: (brick: Brick) => void;
    cloneBrick: () => void;
    removeBrick: () => void;
}

export function BrickRow(props: BrickRowProps) {
    const { brick, index, removeBrick, updateBrick, cloneBrick } = props;

    const clearBrick = () => {
        brick.model = [];
        brick.repr = [];
        updateBrick(brick);
    };

    return (
        <div className="mb-[5rem]">
            <div className="mb-4 flex flex-row space-between items-center justify-between">
                <h2 className="text-4xl">Model #{index}</h2>
                <div className="flex flex-row space-x-4">
                    <button onClick={() => removeBrick()}>remove model</button>
                    <button onClick={() => clearBrick()}>clear model</button>
                    <button onClick={() => cloneBrick()}>clone model</button>
                </div>
            </div>
            <div className="flex flex-row">
                <BrickEditor brick={brick} setBrick={updateBrick} />
                <ModelRenderer model={brick.model} />
            </div>
        </div>
    );
}

export function BrickSetEditor() {
    const [bricks, setBricks] = React.useState<Brick[]>([]);

    const updateBrick = (brick: Brick, index: number) => {
        const copy = bricks.slice();
        copy[index] = {
            model: brick.model,
            repr: brick.repr,
        };
        setBricks(copy);
    };

    const addBrick = () => {
        setBricks([
            {
                model: initialCubeBrick.slice(),
                repr: serializeModel(initialCubeBrick),
            },
            ...bricks,
        ]);
    };

    const removeBrick = (index: number) => {
        const copy = bricks.slice();
        copy.splice(index, 1);
        setBricks(copy);
    };

    const cloneBrick = (index: number) => {
        const brick = bricks[index];
        const repr = brick.repr.slice();
        const model = repr.map((repr) => parseFace(repr, '/'));
        const copy = bricks.slice();
        copy.splice(index, 0, {
            model,
            repr,
        });
        setBricks(copy);
    };

    const exportModels = () => {
        const json = JSON.stringify(bricks);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'models.json';
        link.click();
        link.remove();
    };

    const importModels = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const json = event.target?.result;
                if (json) {
                    const models = JSON.parse(json as string);
                    setBricks([...bricks, ...models]);
                }
            };
            reader.readAsText(file);
        }
    };

    const importStandardModels = async () => {
        try {
            const respons = await fetch('/models.json');
            const models = await respons.json();
            setBricks([...bricks, ...models]);
        } catch (error) {
            console.error("Couldn't load standard models.");
            console.error(error);
        }
    };

    return (
        <Container>
            <div className="flex felx-row my-4">
                <input
                    type="file"
                    id="model"
                    name="model"
                    className="hidden"
                    multiple={true}
                    onChange={importModels}
                />
                <label htmlFor="model" className="pr-4 cursor-pointer">
                    import local models
                </label>
                <button onClick={importStandardModels} className="pr-4">
                    import standard models
                </button>
                <button onClick={exportModels} className="pr-4">
                    export models
                </button>
                <button onClick={addBrick} className="pr-4">
                    add model
                </button>
            </div>
            {bricks.map((brick, index) => (
                <BrickRow
                    key={index}
                    index={index}
                    brick={brick}
                    removeBrick={() => removeBrick(index)}
                    updateBrick={(brick) => updateBrick(brick, index)}
                    cloneBrick={() => cloneBrick(index)}
                />
            ))}
        </Container>
    );
}
