import React from 'react';
import { VscFolderOpened } from 'react-icons/vsc';

import { CoordinateMode, load, useCreateModels } from '@utils/utils';

import { ButtonFileInput } from '@elements/Button';
import { useLoadingStatus, useProcessing } from '@elements/Context';
import { DirectionControls } from '@elements/Controls/ControlsDirection';
import { ProjectionControls } from '@elements/Controls/ControlsProjection';
import { SelectionControls } from '@elements/Controls/ControlsSelect';
import { ShaderControls } from '@elements/Controls/ControlsShader';
import { MenuButton, MenuGroup } from '@elements/MenuButton';

export function Menu() {
    const create = useCreateModels();
    const [, setProcessing] = useProcessing();
    const [, setLoadingStatue] = useLoadingStatus();

    const onModelsSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoadingStatue('Loading models...');
        setProcessing(true);
        const models = await load(event, () => {});
        await create(models, {
            coordMode: CoordinateMode.None,
        });
        setProcessing(false);
        event.target.value = '';
        event.preventDefault();
    };

    return (
        <div className="absolute m-4 space-x-2 left-0 top-0 z-0 flex flex-row">
            <MenuGroup>
                <MenuButton>
                    <ButtonFileInput id="models" onChange={onModelsSelected} unstyled>
                        <div className="flex flex-row items-center">
                            <VscFolderOpened className="text-xl mr-2" />
                            Import Models
                        </div>
                    </ButtonFileInput>
                </MenuButton>
            </MenuGroup>
            <ProjectionControls />
            <DirectionControls />
            <ShaderControls />
            <SelectionControls />
        </div>
    );
}
