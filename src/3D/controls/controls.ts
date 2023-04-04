import { View } from '@3D/renderer/view';
import { Window } from '@3D/renderer/window';

import { ViewControls } from './viewControl';

export class WindowControls {
    private activeView_: View | null = null;
    private lastX_: number = 0;
    private lastY_: number = 0;

    constructor(private canvas: HTMLCanvasElement, private window: Window) {
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        canvas.addEventListener('wheel', this.onMouseWheel.bind(this));
        canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
    }

    onMouseDown(event: MouseEvent) {
        const local = this.window.getViewAndPosition(event);
        if (!local) return;
        const { view, x, y } = local;
        this.activeView_ = view;
    }

    onMouseMove(event: MouseEvent) {
        //TODO
    }

    onMouseUp(event: MouseEvent) {
        //TODO
    }

    onMouseWheel(event: WheelEvent) {
        //TODO
    }

    onContextMenu(event: MouseEvent) {
        //TODO
    }
}
