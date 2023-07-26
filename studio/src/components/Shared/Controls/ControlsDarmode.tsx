import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

import { MenuButton, MenuGroup } from '@elements/Button';

import { useDarkmode } from '@shared/Context/hooks';

export function DarkmodeControls() {
    const [darkmode, setDarkmode] = useDarkmode();

    return (
        <MenuGroup>
            <MenuButton
                onClick={() => setDarkmode(!true)}
                tipTitle="Perspective Camera"
                active={!darkmode}
            >
                <MdOutlineLightMode className="text-2xl" />
            </MenuButton>
            <MenuButton
                onClick={() => setDarkmode(true)}
                tipTitle="Orthographic Camera"
                active={darkmode}
            >
                <MdOutlineDarkMode className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}
