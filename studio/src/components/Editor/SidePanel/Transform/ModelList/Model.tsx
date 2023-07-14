import clsx from 'clsx';
import React from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { BiCube, BiCubeAlt } from 'react-icons/bi';
import { VscEdit } from 'react-icons/vsc';

import { EditorModel } from '@utils/utils';

import { colorActive, colorBase } from '@elements/Colors';
import { Input } from '@elements/Input';

interface ModelProps {
    selected: boolean;
    onSelect: () => void;
    model: EditorModel;
}

export function Model(props: ModelProps): JSX.Element {
    const { model, onSelect, selected } = props;
    const [visible, setVisible] = React.useState<boolean>(model.visible);
    const [editing, setEditing] = React.useState<boolean>(false);

    const toggleVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        model.visible = !model.visible;
        setVisible(model.visible);
        event.stopPropagation();
    };

    const toggleEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
        setEditing(!editing);
        event.stopPropagation();
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setEditing(false);
        }
        event.stopPropagation();
    };

    const renameModel = (event: React.ChangeEvent<HTMLInputElement>) => {
        model.name = event.target.value;
    };

    return (
        <div
            className={clsx(
                'text-lg rounded-md cursor-pointer flex flex-row items-stretch',
                selected ? colorActive : colorBase
            )}
            onClick={onSelect}
        >
            <div className="px-4 flex flex-row items-center flex-1 truncate">
                <BiCube className="mr-4" />
                {editing ? (
                    <Input
                        className="flex-1 py-2 bg-amber-300 text-amber-600 outline-none px-2"
                        defaultValue={model.name}
                        onChange={renameModel}
                        onKeyDown={handleEnter}
                    />
                ) : (
                    <div className="flex-1 py-2">{model.name}</div>
                )}
            </div>
            <button className="px-4 rounded-r-md" onClick={toggleEditing} title="Rename">
                <VscEdit />
            </button>
            <button
                className="px-4 rounded-r-md"
                onClick={toggleVisibility}
                title="Toggle visibility"
            >
                {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
        </div>
    );
}
