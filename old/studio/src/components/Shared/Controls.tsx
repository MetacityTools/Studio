import clsx from 'clsx';

import { useGreyscale } from '@hooks/useGreyscale';

import { DarkmodeControls } from './ControlsDarkmode';
import { DirectionControls } from './ControlsDirection';
import { ProjectionControls } from './ControlsProjection';
import { ScreenshotControls } from './ControlsScreenshot';
import { SelectionControls } from './ControlsSelect';
import { ShaderControls } from './ControlsShader';

export function Controls() {
    const [greyscale] = useGreyscale();
    return (
        <>
            <div
                className={clsx(
                    'absolute m-4 left-0 top-0 z-0 flex flex-row space-x-2',
                    greyscale ? 'filter grayscale' : 'filter-none'
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
                    greyscale ? 'filter grayscale' : 'filter-none'
                )}
            >
                <DarkmodeControls />
            </div>
        </>
    );
}
