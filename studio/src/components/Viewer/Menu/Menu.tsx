import React from 'react';

import { CoordinateMode, load, useCreateModels } from '@utils/utils';

import { ButtonFileInput } from '@elements/Button';
import { MenuButton, MenuGroup } from '@elements/MenuButton';

export function Menu() {
    const create = useCreateModels();

    const onModelsSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        //setProcessing(true);
        const models = await load(event, () => {});
        await create(models, {
            coordMode: CoordinateMode.None,
        });
        //setImportOpen(true);
        //setProcessing(false);
        event.target.value = '';
        event.preventDefault();
    };

    return (
        <div className="absolute m-4 space-x-2 left-0 top-0 z-0 flex flex-row">
            <MenuGroup>
                <MenuButton>
                    <ButtonFileInput id="models" onChange={onModelsSelected} unstyled>
                        Import Models
                    </ButtonFileInput>
                </MenuButton>
            </MenuGroup>
        </div>
    );
}
