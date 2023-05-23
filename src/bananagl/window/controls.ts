import { vec2 } from 'gl-matrix';

import { Pickable } from '@bananagl/bananagl';
import { RectSelector } from '@bananagl/picking/rect';
import { View } from '@bananagl/window/view';
import { Window } from '@bananagl/window/window';

import { Shortcut } from './shortcuts';

//TODO
//Refactor this wild west into something more comprehensible
//HOW
//remove the Event Listener binds from the WindowControls class
//and leave it up to the progammer/framework to bind the events
//this way, the programmer could also add custom events such as on touch etc.

export class WindowControls {
    public activeView: View | null = null;

    constructor(private window: Window) {}

    pointerDown(event: PointerEvent) {}

    pointerMove(event: PointerEvent) {}

    pointerUp(event: PointerEvent) {}

    mouseWheel(event: WheelEvent) {}

    mouseOut(event: MouseEvent) {}

    contextMenu(event: MouseEvent) {
        event.preventDefault();
    }

    keydown(event: KeyboardEvent) {}

    keyup(event: KeyboardEvent) {}

    addShortcut(shortcut: Shortcut) {}

    removeShortcut(shortcut: Shortcut) {}
}

interface IMouseEvent {
    view: View;
    x: number;
    y: number;
    button: number;
}

class MouseControls {
    private lastX: number = 0;
    private lastY: number = 0;
    private dpr: number = window.devicePixelRatio;
    constructor(public c: WindowControls) {}

    mouseMove(event: IMouseEvent) {}
}

class PanMouseControls {
    constructor(private c: MouseControls) {}
    mouseMove(event: MouseEvent) {}
}

class RotateMouseControls {}
class ZoomMouseControls {}
class PickMouseControls {}
class RangePickMouseControls {}

class MouseControls2 {
    private lastX: number = 0;
    private lastY: number = 0;
    private mouseDown: boolean = false;
    private middleMouse: boolean = false;
    private rightMouse: boolean = false;
    private downTime: number = 0;
    private offsetOnDown: vec2 = [Infinity, Infinity];

    private onMouseDown(event: MouseEvent) {
        const localView = this.window.getViewAndPosition(event);
        if (!localView) return;
        const { view, x, y } = localView;
        this.activeView = view;
        this.lastX = x;
        this.lastY = y;
        this.mouseDown = true;

        if (event.button === 1) this.middleMouse = true;
        if (event.button === 2) this.rightMouse = true;
        if (this.shiftKeyPressed) {
            this.offsetOnDown = this.activeView.toNDC(event.offsetX, event.offsetY);
            this.selectMode = true;
        }

        this.downTime = Date.now();
    }

    private onMouseMove(event: MouseEvent) {
        if (!this.activeView) return;
        const { offsetX, offsetY } = event;
        const dx = (offsetX - this.lastX) * this.dpr;
        const dy = (offsetY - this.lastY) * this.dpr;
        this.lastX = offsetX;
        this.lastY = offsetY;

        if (this.activeShortcut && this.activeShortcut.onMove) {
            this.activeShortcut.onMove(this.activeView, dx, dy);
        } else if (this.mouseDown) {
            //TODO fix this
            if (this.selectMode) {
                //??
            } else if (this.altKeyPressed || this.middleMouse || this.rightMouse) {
                this.activeView.cameraLock.restrictRotate(dx, dy);
                const { coords } = this.activeView.cameraLock;
                this.activeView.camera.rotate(coords[0], coords[1]);
            } else {
                this.activeView.camera.pan(dx, dy);
            }
        }
    }

    private onMouseUp(event: MouseEvent) {
        if (this.activeShortcut) this.activeShortcut = null;
        else if (this.clickDuration < 200) this.trace(event);
        else if (this.selectMode) {
            this.rectTrace(event);
            this.selectMode = false;
        }
        this.finish(event);
    }

    private onMouseWheel(event: WheelEvent) {
        const local = this.window.getViewAndPosition(event);
        if (!local) return;
        const { view, lx, ly } = local;
        view.camera.zoom(event.deltaY, lx, ly);
    }

    private onMouseOut = (event: MouseEvent) => {
        this.finish(event);
    };

    private onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    };

    get clickDuration() {
        return Date.now() - this.downTime;
    }

    private finish(event: MouseEvent) {
        event.preventDefault();
        const button = event.button;
        if (!this.mouseDown) return;
        if (button === 1 || button === -1) this.middleMouse = false;
        if (button === 2 || button === -1) this.rightMouse = false;
        this.mouseDown = false;
    }
}

class KeyboardControls {
    private keyMap: { [key: string]: boolean } = {};
    private shortcuts: Shortcut[] = [];
    private activeShortcut: Shortcut | null = null;

    addShortcut(shortcut: Shortcut) {
        this.shortcuts.push(shortcut);
    }

    removeShortcut(shortcut: Shortcut) {
        const index = this.shortcuts.indexOf(shortcut);
        if (index >= 0) this.shortcuts.splice(index, 1);
        else console.warn('Shortcut not found', this.shortcuts, shortcut);
    }

    get shiftKeyPressed() {
        return this.keyMap['ShiftLeft'];
    }

    get altKeyPressed() {
        return this.keyMap['AltLeft'] || this.keyMap['MetaLeft'];
    }

    get escapeKeyPressed() {
        return this.keyMap['Escape'];
    }

    private callShortcuts() {
        if (this.escapeKeyPressed) {
            if (this.activeShortcut && this.activeShortcut.onCancel) {
                this.activeShortcut.onCancel();
                this.activeShortcut = null;
            }
        }

        for (const shortcut of this.shortcuts) {
            if (this.keyMap[shortcut.code] === true) {
                if (shortcut.onPress && this.activeView) shortcut.onPress(this.activeView);
                if (shortcut.onMove && this.activeView && !this.activeShortcut) {
                    this.activeShortcut = shortcut;
                    shortcut.onStart && shortcut.onStart(this.activeView);
                }
            }
        }
    }

    private onKeyDown(event: KeyboardEvent) {
        const { code } = event;
        console.log('keydown', code);
        this.keyMap[code] = true;
        this.callShortcuts();
    }

    private onKeyUp(event: KeyboardEvent) {
        const { code } = event;
        this.keyMap[code] = false;
    }
}

class TracingControls {
    private trace(event: MouseEvent) {
        if (!this.activeView) return;
        const { offsetX, offsetY } = event;
        const ndc = this.activeView.toNDC(offsetX, offsetY);
        const ray = this.activeView.camera.primaryRay(ndc[0], ndc[1]);
        const hit = this.activeView.scene.picker.trace(ray);
        if (hit && hit.object.onPick) {
            hit.object.onPick(hit.object, hit.primitiveIndex, this.shiftKeyPressed);
            if (this.onPick) this.onPick(hit.object);
        }
    }

    private rectTrace(event: MouseEvent) {
        if (!this.activeView) return;
        const { offsetX, offsetY } = event;
        const ndc = this.activeView.toNDC(offsetX, offsetY);
        const rect = new RectSelector(this.activeView.camera, this.offsetOnDown, ndc);
        const hits = this.activeView.scene.picker.traceRect(rect);
        if (hits && hits.object.onPick) {
            hits.object.onPick(hits.object, hits.primitiveIndices, true);
            if (this.onPick) this.onPick(hits.object);
        }
    }
}
