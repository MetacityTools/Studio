import React from 'react';

import { Renderer } from '@3D/3D';
import { View as ViewClass } from '@3D/renderer/view';

import { View, ViewProps } from './View';

interface CanvasProps {
    renderer: Renderer;
    children?:
        | React.ReactElement<ViewProps, typeof View>
        | React.ReactElement<ViewProps, typeof View>[];
    className?: string;
    options?: WebGLContextAttributes;
    debugLayout?: boolean;
}

export function Canvas(props: CanvasProps) {
    const { options, renderer, children } = props;
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        console.log('Canvas mounted');
        if (canvasRef.current && renderer) {
            renderer.init(canvasRef.current, options);
            const viewArray = React.Children.toArray(children) as React.ReactElement<
                ViewProps,
                typeof View
            >[];
            for (const view of viewArray) {
                const viewObject = new ViewClass(view.props.scene);
                const viewSize = {
                    width: view.props.width,
                    height: view.props.height,
                    mode: view.props.sizeMode ?? 'relative',
                };
                const viewPosition = {
                    top: view.props.top,
                    left: view.props.left,
                    right: view.props.right,
                    bottom: view.props.bottom,
                    mode: view.props.positionMode ?? 'relative',
                };
                renderer.views.add(viewObject, viewSize, viewPosition);
            }

            renderer.views.forceResize();

            if (props.debugLayout) {
                renderer.renderLayout();
            }
        }
    }, [canvasRef, renderer]);

    return (
        <div className={props.className}>
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}
