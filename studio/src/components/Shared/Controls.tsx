import clsx from 'clsx';

import { useGrayscale } from '../../hooks/hooks';
import { DarkmodeControls } from './ControlsDarkmode';
import { DirectionControls } from './ControlsDirection';
import { ProjectionControls } from './ControlsProjection';
import { ScreenshotControls } from './ControlsScreenshot';
import { SelectionControls } from './ControlsSelect';
import { ShaderControls } from './ControlsShader';

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
