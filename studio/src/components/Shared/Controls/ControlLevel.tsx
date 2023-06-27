import React from 'react';
import { FiLayers } from 'react-icons/fi';
import { HiArrowSmDown, HiArrowSmUp } from 'react-icons/hi';
import { TbPerspective } from 'react-icons/tb';

import * as GL from '@bananagl/bananagl';

import { MenuButton, MenuGroup } from '@elements/Button';

import { useActiveView, useLevel, useRenderer } from '@shared/Context/hooks';

export function LevelControls() {
    const [level, setLevel] = useLevel();

    const levelUp = () => {
        setLevel(level + 1);
    };

    const levelDown = () => {
        if (level > 0) {
            setLevel(level - 1);
        }
    };

    return (
        <MenuGroup>
            <MenuButton onClick={levelDown} tipTitle="Level Down">
                <HiArrowSmDown className="text-2xl" />
            </MenuButton>
            <MenuButton onClick={levelDown} tipTitle="Hierarchy level used for styling" disabled>
                <span className="flex flex-row items-center text-base">
                    <FiLayers className="mr-2" /> {level}
                </span>
            </MenuButton>
            <MenuButton onClick={levelUp} tipTitle="Level Up">
                <HiArrowSmUp className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}
