import React from 'react';
import { MdDeselect } from 'react-icons/md';

import { MenuButton, MenuGroup } from '@elements/Button';

import { useSelection } from '@shared/Context/hooks';

export function SelectionControls() {
    const [select] = useSelection();

    const deselect = () => {
        select(new Map());
    };

    return (
        <MenuGroup>
            <MenuButton onClick={deselect} tipTitle="Deselect all">
                <MdDeselect className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}
