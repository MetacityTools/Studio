import { useRenderer } from '@hooks/hooks';
import { AiFillCamera } from 'react-icons/ai';

import { MenuButton, MenuGroup } from '@elements/Button';

export function ScreenshotControls() {
    const renderer = useRenderer();

    const saveCanvas = () => {
        //save contents of the canvas to a png file
        renderer.afterRenderOnce = () => {
            const canvas: HTMLCanvasElement = renderer.window.rawCanvas;

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'render.png';
            link.href = image;
            link.click();
        };
    };

    return (
        <MenuGroup>
            <MenuButton onClick={saveCanvas} tipTitle="Save render">
                <AiFillCamera className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}
