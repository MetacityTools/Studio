import React from 'react';

import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { MenuGroup, MenuInput } from '@elements/MenuButton';

import { EditorMenuProps } from '../ViewControls';

export function Shading(props: EditorMenuProps) {
    const { scene } = props;
    const [minShade, setMinShade] = React.useState<number>(0);
    const [maxShade, setMaxShade] = React.useState<number>(10);

    const updateMinShade = (value: number) => {
        if (isNaN(value)) return;
        scene.objects.forEach((object) => {
            if (object instanceof EditorModel) {
                object.uniforms = {
                    uZMin: value,
                };
            }
        });

        setMinShade(value);
    };

    const updateMaxShade = (value: number) => {
        if (isNaN(value)) return;
        scene.objects.forEach((object) => {
            if (object instanceof EditorModel) {
                object.uniforms = {
                    uZMax: value,
                };
            }
        });

        setMaxShade(value);
    };

    return (
        <MenuGroup column>
            <MenuInput label="Min Shade Level" value={minShade} onChange={updateMinShade} />
            <MenuInput label="Max Shade Level" value={maxShade} onChange={updateMaxShade} />
        </MenuGroup>
    );
}
