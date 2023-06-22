import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineCloseCircle } from 'react-icons/ai';

import { createGroup, useGraph, useSelectedModels } from '@utils/utils';

import { useMovingNode, useStatus } from '@editor/EditorContext';

import { Button } from '@elements/Button';

export function MetadataMenu() {
    const selection = useSelectedModels();
    const [graph] = useGraph();
    const [nodeToMove, updateNodeToMove] = useMovingNode();
    const [status] = useStatus();

    const group = () => {
        createGroup(selection, graph);
    };

    const unmove = () => {
        updateNodeToMove(undefined);
    };

    return (
        <div className="flex flex-row p-4 w-full border-b items-center">
            <div className="flex flex-row items-center space-x-2 w-full">
                <Button onClick={group}>Group Selected Models</Button>
                <Button onClick={unmove} disabled={!nodeToMove}>
                    End Move
                </Button>
            </div>
            <div className="flex flex-row items-center">
                {status === 'editing' && <Editing />}
                {status === 'saved' && <Saved />}
                {status === 'failed' && <Failed />}
            </div>
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
