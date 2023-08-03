import { MdDeselect, MdSelectAll } from 'react-icons/md';

import { MenuButton, MenuGroup } from '@elements/ButtonMenu';

import { useModels } from '@hooks/useModels';
import { useSelection } from '@hooks/useSelection';

export function SelectionControls() {
    const models = useModels();
    const select = useSelection();

    const selectAll = () => {
        const selected = new Map();
        models.forEach((model) => {
            const submodels = Object.keys(model.metadata).map((key) => parseInt(key));
            selected.set(model, new Set(submodels));
        });
        select(selected);
    };

    const deselect = () => {
        select(new Map());
    };

    return (
        <MenuGroup>
            <MenuButton onClick={selectAll} tipTitle="Select all">
                <MdSelectAll className="text-2xl" />
            </MenuButton>
            <MenuButton onClick={deselect} tipTitle="Deselect all">
                <MdDeselect className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}
