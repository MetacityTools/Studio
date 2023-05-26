import React from 'react';

export function EmptyDataPanel() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-4xl text-neutral-300 text-center">No models</div>
        </div>
    );
}

export function EmptyDetailPanel() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-4xl text-neutral-300 text-center">Select a model</div>
        </div>
    );
}

export function EmptyMetaPanel() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-4xl text-neutral-300 text-center">Select a part of the model</div>
        </div>
    );
}
