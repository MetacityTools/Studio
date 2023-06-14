import { DirectionControls } from '@elements/Controls/ControlsDirection';
import { ProjectionControls } from '@elements/Controls/ControlsProjection';
import { SelectionControls } from '@elements/Controls/ControlsSelect';
import { ShaderControls } from '@elements/Controls/ControlsShader';

import { ModeControls } from './ControlsMode';

export function Controls() {
    return (
        <>
            <div className="absolute m-4 space-x-2 left-0 top-0 z-0 flex flex-row">
                <ProjectionControls />
                <DirectionControls />
                <ShaderControls />
                <SelectionControls />
            </div>
            <div className="absolute m-4 space-x-2 right-0 top-0 z-0 flex flex-row">
                <ModeControls />
            </div>
        </>
    );
}
