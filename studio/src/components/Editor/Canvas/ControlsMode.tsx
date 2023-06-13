import React from 'react';
import { VscJson, VscMove } from 'react-icons/vsc';

import * as GL from '@bananagl/bananagl';

import { EditingMode, useEditingMode } from '@editor/Context/EditorContext';

import { MenuButton, MenuGroup } from '@elements/MenuButton';

export function ModeControls() {
    const [mode, setMode] = useEditingMode();

    const [projection, setProjection] = React.useState<GL.ProjectionType>(
        GL.ProjectionType.ORTHOGRAPHIC
    );

    return (
        <MenuGroup column>
            <MenuButton
                onClick={() => setMode(EditingMode.Transform)}
                tipTitle="Transfomr Editing Mode"
                active={mode === EditingMode.Transform}
                column
            >
                <VscMove className="text-2xl" />
            </MenuButton>
            <MenuButton
                onClick={() => setMode(EditingMode.Table)}
                tipTitle="Metadata Editing Mode"
                active={mode === EditingMode.Table}
                column
            >
                <VscJson className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}
