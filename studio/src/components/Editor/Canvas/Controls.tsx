import { DirectionControls } from './Controls/Direction';
import { ProjectionControls } from './Controls/Projection';
import { SelectionControls } from './Controls/Select';
import { ShaderControls } from './Controls/Shader';

export function ViewControls() {
    return (
        <div className="absolute m-4 space-x-2 left-0 top-0 z-40 flex flex-row">
            <ProjectionControls />
            <DirectionControls />
            <ShaderControls />
            <SelectionControls />
        </div>
    );
}
