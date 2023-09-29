import { useEffect } from 'react';

import { useResize } from '@gl/hooks/useResize';

import { useCanvasRef } from '../hooks/useCanvas';

const debounce = (fn: Function, time: number) => {
    let timeout: any;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, time);
    };
};

type CanvasProps = {
    children: React.ReactNode;
};

export const Canvas = (props: CanvasProps) => {
    const canvasRef = useCanvasRef();
    const [size, setSize] = useResize();

    useEffect(() => {
        const observer = new ResizeObserver(
            debounce((entries: ResizeObserverEntry[]) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    setSize([width, height]);
                }
            }, 100)
        );
        observer.observe(canvasRef.current!);
        return () => observer.disconnect();
    }, [canvasRef]);

    return (
        <>
            <canvas ref={canvasRef} className="w-full h-full" />
            {props.children}
        </>
    );
};
