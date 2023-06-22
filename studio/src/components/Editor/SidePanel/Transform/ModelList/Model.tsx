import clsx from 'clsx';
import React from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { BiCube, BiCubeAlt } from 'react-icons/bi';

import { EditorModel } from '@utils/utils';

import { colorActive, colorBase } from '@elements/colors';

interface ModelProps {
    selected: boolean;
    onSelect: () => void;
    model: EditorModel;
}

export function Model(props: ModelProps): JSX.Element {
    const { model, onSelect, selected } = props;
    const [visible, setVisible] = React.useState<boolean>(model.visible);

    const toggleVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        model.visible = !model.visible;
        setVisible(model.visible);
        event.stopPropagation();
    };

    return (
        <div
            className={clsx(
                'text-lg rounded-md cursor-pointer flex flex-row items-stretch',
                selected ? colorActive : colorBase
            )}
            onClick={onSelect}
        >
            <div className="px-4 py-2 flex flex-row items-center flex-1 truncate">
                <BiCube className="mr-4" />
                <div className="flex-1">{model.name}</div>
            </div>
            <button className="px-4 rounded-r-md" onClick={toggleVisibility}>
                {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
        </div>
    );
}
