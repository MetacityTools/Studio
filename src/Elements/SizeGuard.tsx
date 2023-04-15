import React from 'react';

function UnsuitableSize() {
    return (
        <div className="absolute inset-0 flex flex-col place-content-center place-items-center z-50 bg-white">
            <div className="text-4xl mb-4 text-gray-500">Oops :(</div>
            <div className="text-xs text-gray-500">
                The window is too small to display the content
            </div>
        </div>
    );
}

interface SizeGuardProps {
    children: React.ReactNode;
    minWidth: number;
    minHeight: number;
}

export function SizeGuard(props: SizeGuardProps) {
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);

    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const resize = () => {
            if (ref.current) {
                setWidth(ref.current.clientWidth);
                setHeight(ref.current.clientHeight);
                console.log(ref.current.clientWidth, ref.current.clientHeight);
            }
        };

        resize();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div ref={ref} className="w-full h-full">
            {(width < props.minWidth || height < props.minHeight) && <UnsuitableSize />}
            {props.children}
        </div>
    );
}
