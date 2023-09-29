import { createContext, useEffect, useState } from 'react';

import { useCanvasRef } from '@gl/hooks/useCanvas';
import { useDebouce } from '@gl/hooks/useDebounce';

type CanvasSize = {
    width: number;
    height: number;
};

type CanvasProviderProps = {
    size: CanvasSize;
    setSize: React.Dispatch<React.SetStateAction<CanvasSize>>;
};

export const context = createContext<CanvasProviderProps>({} as CanvasProviderProps);

type CanvasProps = {
    children: React.ReactNode;
};

export const Canvas = (props: CanvasProps) => {
    const canvasRef = useCanvasRef();
    const [size, setSize] = useState<CanvasSize>({
        width: canvasRef.current?.clientWidth ?? 0,
        height: canvasRef.current?.clientHeight ?? 0,
    });
    const debounce = useDebouce();

    useEffect(() => {
        const observer = new ResizeObserver(
            debounce((entries: ResizeObserverEntry[]) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    const canvas = canvasRef.current;
                    if (!canvas) return;
                    const dpr = window.devicePixelRatio;
                    canvas.width = width * dpr;
                    canvas.height = height * dpr;
                    setSize({
                        width: canvas.width,
                        height: canvas.height,
                    });
                }
            }, 100)
        );
        observer.observe(canvasRef.current!);
        return () => observer.disconnect();
    }, [canvasRef]);

    return (
        <context.Provider
            value={{
                size,
                setSize,
            }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full outline-none"
                key="canvas"
                tabIndex={1000}
            />
            {props.children}
        </context.Provider>
    );
};
