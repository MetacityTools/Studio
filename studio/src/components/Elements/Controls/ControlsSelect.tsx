import React from 'react';
import { MdDeselect } from 'react-icons/md';

import { useSelection } from '@utils/utils';

import { MenuButton, MenuGroup } from '@elements/Button';

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
