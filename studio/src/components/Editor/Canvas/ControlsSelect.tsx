import React from 'react';
import { MdDeselect } from 'react-icons/md';

import { EditorContext } from '@editor/Context/EditorContext';

import { MenuButton, MenuGroup } from '@elements/MenuButton';

export function SelectionControls() {
    const { select } = React.useContext(EditorContext);

    const deselect = () => {
        select(null);
    };

    return (
        <MenuGroup>
            <MenuButton onClick={deselect} tipTitle="Deselect all" tipPosition="top">
                <MdDeselect className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}
