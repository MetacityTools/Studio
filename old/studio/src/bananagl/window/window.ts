import { WindowControls } from '@bananagl/window/controls';

import { Renderer } from '../renderer/renderer';
import { View } from './view';

export interface ViewSize {
    width: number;
    height: number;
    mode: 'absolute' | 'relative';
}

export interface ViewPosition {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    mode: 'absolute' | 'relative';
}

export interface ViewSetup {
    view: View;
    size: ViewSize;
    position: ViewPosition;
}

const debounce = (fn: Function, time: number) => {
    let timeout: any;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, time);
    };
};

export class Window {
    private views_: ViewSetup[] = [];
    controls: WindowControls;

    constructor(private canvas: HTMLCanvasElement) {
        const observer = new ResizeObserver(
            debounce((entries: ResizeObserverEntry[]) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    this.resize(width, height);
                }
            }, 100)
        );

        observer.observe(canvas);
        this.forceResize();
        this.controls = new WindowControls(this);
    }

    dispose() {
        this.views_ = [];
    }

    get views() {
        return this.views_;
    }

    forceResize() {
        this.resize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    resize(width: number, height: number) {
        const dpr = window.devicePixelRatio;
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.views_.forEach(({ view, size, position }) => {
            const { x, y, w, h } = this.compute(
                size,
                position,
                this.canvas.width,
                this.canvas.height
            );
            view.resize(x, y, w, h);
        });
    }

    add(view: View, size: ViewSize, position: ViewPosition) {
        this.views_.push({ view, size, position });
    }

    private compute(size: ViewSize, position: ViewPosition, width: number, height: number) {
        const { mode: sizeMode } = size;
        const { mode: positionMode } = position;

        const w = sizeMode === 'absolute' ? size.width : size.width * width * 0.01;
        const h = sizeMode === 'absolute' ? size.height : size.height * height * 0.01;

        let x = 0;
        let y = 0;

        if (positionMode === 'absolute') {
            if (position.left !== undefined) x = position.left;
            if (position.right !== undefined) x = width - position.right - w;
            if (position.bottom !== undefined) y = position.bottom;
            if (position.top !== undefined) y = height - position.top - h;
        } else {
            //percent
            if (position.left !== undefined) x = position.left * 0.01 * width;
            if (position.right !== undefined) x = width - position.right * 0.01 * width - w;
            if (position.bottom !== undefined) y = position.bottom * 0.01 * height;
            if (position.top !== undefined) y = height - position.top * 0.01 * height - h;
        }
        return { x, y, w, h };
    }

    render(renderer: Renderer) {
        this.views_.forEach(({ view }) => view.render(renderer));
    }

    private getOffset(event: any) {
        const xpos: number = (!event.offsetX ? event.layerX! : event.offsetX) ?? 0;
        const ypos: number = (!event.offsetY ? event.layerY! : event.offsetY) ?? 0;
        return { xpos, ypos };
    }

    getViewAndPosition(e: MouseEvent) {
        //NOTE this is a fix for firefox that does not support offsetX and offsetY
        const { xpos, ypos } = this.getOffset(e);

        //recompute offestY from bottom
        const { height } = this.canvas;
        const offsetYbottom = height - ypos;
        for (const { view } of this.views_) {
            const [x, y] = view.toLocal(xpos, offsetYbottom);
            if (x >= 0 && x < view.width && y >= 0 && y < view.height) {
                return { view, x: xpos, y: ypos, lx: x, ly: y };
            }
        }
        return undefined;
    }

    get rawCanvas() {
        return this.canvas;
    }
}
