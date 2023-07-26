import clsx from 'clsx';

import { useGrayscale } from './Context/hooks';
import { DarkmodeControls } from './Controls/ControlsDarkmode';
import { DirectionControls } from './Controls/ControlsDirection';
import { ProjectionControls } from './Controls/ControlsProjection';
import { ScreenshotControls } from './Controls/ControlsScreenshot';
import { SelectionControls } from './Controls/ControlsSelect';
import { ShaderControls } from './Controls/ControlsShader';

export function Controls() {
    const [grayscale] = useGrayscale();
    return (
        <>
            <div
                className={clsx(
                    'absolute m-4 left-0 top-0 z-0 flex flex-row space-x-2',
                    grayscale ? 'filter grayscale' : 'filter-none'
                )}
            >
                <ProjectionControls />
                <DirectionControls />
                <ShaderControls />
                <SelectionControls />
                <ScreenshotControls />
            </div>
            <div
                className={clsx(
                    'absolute m-4 right-0 top-0 z-0 flex flex-row space-x-2',
                    grayscale ? 'filter grayscale' : 'filter-none'
                )}
            >
                <DarkmodeControls />
            </div>
        </>
    );
}
