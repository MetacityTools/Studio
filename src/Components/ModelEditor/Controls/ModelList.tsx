import React from 'react';
import { GrCubes } from 'react-icons/gr';
import { HiOutlineCubeTransparent } from 'react-icons/hi';
import { RiBuilding2Fill } from 'react-icons/ri';
import { TbTriangleFilled } from 'react-icons/tb';

import { EditorModel } from '@utils/models/EditorModel';

function ModelPanel(props: { model: EditorModel }): JSX.Element {
    const { model } = props;
    const [showSub, setShowSub] = React.useState(false);

    return (
        <div>
            <div
                className="text-lg bg-white px-4 py-2 rounded-md text-black hover:shadow-even hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => {
                    setShowSub(!showSub);
                }}
            >
                <div className="flex flex-row items-center">
                    <RiBuilding2Fill className="mr-4 text-neutral-600" /> {model.name}
                </div>
                {showSub && (
                    <div className="space-y-1 my-4">
                        {Object.keys(model.data).map((key) => (
                            <div
                                key={key}
                                className="text-sm bg-neutral-100 px-4 py-2 ml-2 rounded-md hover:bg-neutral-200 transition-all cursor-pointer"
                                onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                    console.log(key);
                                    event.stopPropagation();
                                }}
                            >
                                <div className="flex flex-row items-center">
                                    <TbTriangleFilled className="mr-4 text-neutral-600" /> {key}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface ModelListProps {
    models: EditorModel[];
}

export function ModelList(props: ModelListProps) {
    return (
        <div className="flex flex-col p-4 space-y-2">
            {props.models.map((model) => (
                <ModelPanel model={model} key={model.name} />
            ))}
        </div>
    );
}
