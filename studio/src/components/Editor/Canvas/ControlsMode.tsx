import { VscJson, VscMove } from 'react-icons/vsc';

import { EditingMode, useEditingMode } from '@editor/Context/EditorContext';

import { MenuButton, MenuGroup } from '@elements/MenuButton';

export function ModeControls() {
    const [mode, setMode] = useEditingMode();

    return (
        <MenuGroup>
            <MenuButton
                onClick={() => setMode(EditingMode.Transform)}
                tipTitle="Transfomr Editing Mode"
                active={mode === EditingMode.Transform}
            >
                <VscMove className="text-2xl" />
            </MenuButton>
            <MenuButton
                onClick={() => setMode(EditingMode.Table)}
                tipTitle="Metadata Editing Mode"
                active={mode === EditingMode.Table}
            >
                <VscJson className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}
