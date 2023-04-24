import * as React from 'react';

import * as GL from '@bananagl/bananagl';

import { Vitals } from './Vitals';

export interface ActionMenuProps {
    onModelsSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onTransformComputed: () => void;

    renderer: GL.Renderer;
    scene: GL.Scene;
}

export function ActionMenu(props: ActionMenuProps) {
    return (
        <div className="flex flex-row p-4 border-b w-full border-b border-white space-x-2">
            <label
                htmlFor="modelInputFiles"
                className="py-2 px-4 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-colors cursor-pointer"
            >
                Load Models
            </label>
            <input
                className="hidden"
                type="file"
                onChange={props.onModelsSelected}
                id="modelInputFiles"
                multiple
            />
            <button
                onClick={props.onTransformComputed}
                className="py-2 px-4 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-colors cursor-pointer"
            >
                Transform
            </button>
            <Vitals scenes={[props.scene]} renderer={props.renderer} />
        </div>
    );
}
