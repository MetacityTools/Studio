import React from 'react';

export function EmptyList() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-4xl text-neutral-300 text-center">No models</div>
        </div>
    );
}

export function EmptyDetail() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-4xl text-neutral-300 text-center">Select a model</div>
        </div>
    );
}

export function EmptyTable() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-4xl text-neutral-300 text-center">No tables</div>
        </div>
    );
}

export function EmptyMetadata() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-4xl text-neutral-300 text-center">Select a part of the model</div>
        </div>
    );
}
