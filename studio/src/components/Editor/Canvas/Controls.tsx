import { DirectionControls } from './ControlsDirection';
import { ModeControls } from './ControlsMode';
import { ProjectionControls } from './ControlsProjection';
import { SelectionControls } from './ControlsSelect';
import { ShaderControls } from './ControlsShader';

export function Controls() {
    return (
        <>
            <div className="absolute m-4 space-x-2 left-0 top-0 z-0 flex flex-row">
                <ProjectionControls />
                <DirectionControls />
                <ShaderControls />
                <SelectionControls />
            </div>
            <div className="absolute mt-4 space-x-2 right-0 top-0 z-0 flex flex-row">
                <ModeControls />
            </div>
        </>
    );
}
