import { DirectionControls } from '@elements/Controls/ControlsDirection';
import { ProjectionControls } from '@elements/Controls/ControlsProjection';
import { RendererControls } from '@elements/Controls/ControlsRenderer';
import { SelectionControls } from '@elements/Controls/ControlsSelect';
import { ShaderControls } from '@elements/Controls/ControlsShader';

export function Controls() {
    return (
        <div className="absolute m-4 left-0 top-0 z-0 flex flex-row space-x-2">
            <ProjectionControls />
            <DirectionControls />
            <ShaderControls />
            <SelectionControls />
            <RendererControls />
        </div>
    );
}
