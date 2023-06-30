import { DirectionControls } from './Controls/ControlsDirection';
import { ProjectionControls } from './Controls/ControlsProjection';
import { RendererControls } from './Controls/ControlsRenderer';
import { SelectionControls } from './Controls/ControlsSelect';
import { ShaderControls } from './Controls/ControlsShader';

export function Controls() {
    return (
        <div className="absolute m-4 left-0 top-0 z-0 flex flex-row space-x-2">
            <ProjectionControls />
            <DirectionControls />
            <ShaderControls />
            <SelectionControls />
        </div>
    );
}
