import React from 'react';
import { AiFillVideoCamera } from 'react-icons/ai';
import { BsGpuCard } from 'react-icons/bs';

import { ProfilerClass, Renderer, Scene } from '@bananagl/bananagl';

function formatByteSize(bytes: number) {
    if (bytes < 1024) {
        return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    } else {
        return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }
}

export interface VitalsProps {
    scenes: Scene[];
    renderer: Renderer;
}

export function Vitals(props: VitalsProps) {
    const [profiler] = React.useState(new ProfilerClass());
    const [fps, setFps] = React.useState(0);
    const [mem, setMem] = React.useState(0);

    React.useEffect(() => {
        props.scenes.forEach((scene) => {
            profiler.addScene(scene);
        });

        profiler.setRenderer(props.renderer);

        const timer = setInterval(() => {
            const mem = profiler.logMemory();
            const fps = profiler.logFps();

            setFps(fps ?? 0);
            setMem(mem);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="flex flex-row place-content-end space-x-4 text-xs p-2 flex-1">
            <div className="flex flex-row items-center w-[5rem] place-content-end">
                <AiFillVideoCamera className="text-lg text-neutral-500 mr-2" />
                {fps.toFixed(0)} FPS
            </div>
            <div className="flex flex-row items-center w-[10rem] place-content-end">
                <BsGpuCard className="text-lg text-neutral-500 mr-2" />
                {formatByteSize(mem)} on GPU
            </div>
        </div>
    );
}
