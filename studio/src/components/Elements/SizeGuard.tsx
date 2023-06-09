import React from 'react';

import cat from '@assets/cat.gif';

function UnsuitableSize() {
    return (
        <div className="absolute inset-0 flex flex-col place-content-center place-items-center z-50 bg-white">
            <img src={cat} alt="cat" className="w-32 h-32 disable-blur" />
            <p className="max-w-xs text-center leading-normal">
                Sorry, Metacity Studio <span className="font-bold">requires larger screen</span> to
                display the content.
            </p>
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
