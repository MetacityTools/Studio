import clsx from 'clsx';

import { useGrayscale } from './Context/hooks';
import { DirectionControls } from './Controls/ControlsDirection';
import { ProjectionControls } from './Controls/ControlsProjection';
import { SelectionControls } from './Controls/ControlsSelect';
import { ShaderControls } from './Controls/ControlsShader';

export function Controls() {
    const [grayscale] = useGrayscale();
    return (
        <div
            className={clsx(
                'absolute m-4 left-0 top-0 z-0 flex flex-row space-x-2 transition-all',
                grayscale ? 'filter grayscale' : 'filter-none'
            )}
        >
            <ProjectionControls />
            <DirectionControls />
            <ShaderControls />
            <SelectionControls />
        </div>
    );
}
