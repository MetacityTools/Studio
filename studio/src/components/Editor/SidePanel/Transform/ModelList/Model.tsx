import clsx from 'clsx';
import React from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { VscEdit } from 'react-icons/vsc';

import { EditorModel } from '@utils/utils';

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
                'text-lg cursor-pointer flex flex-row items-stretch',
                selected ? 'hierarchy-active' : 'hierarchy mc-text',
                visible ? 'opacity-100' : 'opacity-60'
            )}
            onClick={onSelect}
        >
            <div className="px-4 flex flex-row items-center flex-1 truncate ">
                {editing ? (
                    <Input
                        className="flex-1 py-1 border mc-border bg-transparent px-2"
                        defaultValue={model.name}
                        onChange={renameModel}
                        onKeyDown={handleEnter}
                    />
                ) : (
                    <div className="flex-1 border border-transparent py-1">{model.name}</div>
                )}
            </div>
            <button className="px-4 opacity-80" onClick={toggleEditing} title="Rename">
                <VscEdit />
            </button>
            <button
                className="px-4 opacity-80"
                onClick={toggleVisibility}
                title="Toggle visibility"
            >
                {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
        </div>
    );
}
