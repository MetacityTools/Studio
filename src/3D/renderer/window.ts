import { Renderer } from './renderer';
import { View } from './view';

interface ViewSize {
    width: number;
    height: number;
    mode: 'absolute' | 'relative';
}

interface ViewPosition {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    mode: 'absolute' | 'relative';
}

export class Window {
    private views: {
        view: View;
        size: ViewSize;
        position: ViewPosition;
    }[] = [];

    constructor(private canvas: HTMLCanvasElement) {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                this.resize(width, height);
            }
        });
        observer.observe(canvas);
        this.forceResize();
    }

    forceResize() {
        this.resize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    resize(width: number, height: number) {
        console.log('resize', width, height);
        //const dpr = window.devicePixelRatio;
        this.canvas.width = width;
        this.canvas.height = height;
        this.views.forEach(({ view, size, position }) => {
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
        this.views.push({ view, size, position });
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
        this.views.forEach(({ view }) => view.render(renderer));
    }

    renderLayout(renderer: Renderer) {
        this.views.forEach(({ view }) => view.renderLayout(renderer));
    }
}
