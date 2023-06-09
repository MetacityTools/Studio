import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineCloseCircle } from 'react-icons/ai';

import { useRenderer, useScene } from '@utils/utils';

import { Vitals } from '@editor/Utils/Vitals';

import { Button } from '@elements/Button';

export function MetaMenu(props: { status?: 'editing' | 'saved' | 'failed' }) {
    const renderer = useRenderer();
    const scene = useScene();

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b items-center">
            <Button>Export</Button>
            {props.status == 'editing' && <Editing />}
            {props.status == 'saved' && <Saved />}
            {props.status == 'failed' && <Failed />}
            <Vitals scenes={[scene]} renderer={renderer} />
        </div>
    );
}

function Saved() {
    return (
        <div className="text-blue-500 flex flex-row items-center px-2">
            <AiOutlineCheckCircle className="text-xl mr-2" /> Saved
        </div>
    );
}

function Failed() {
    return (
        <div className="text-red-500 flex flex-row items-center px-2">
            <AiOutlineCloseCircle className="text-xl mr-2" /> Failed
        </div>
    );
}

function Editing() {
    return (
        <div className="text-neutral-500 flex flex-row items-center px-2">
            <AiOutlineClockCircle className="text-xl mr-2" />
            Idle
        </div>
    );
}
