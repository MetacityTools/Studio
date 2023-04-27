import React from 'react';
import { Link } from 'react-router-dom';

function AppButon(props: { title: string; app: string }) {
    return (
        <Link to={props.app}>
            <div className="px-8 py-4 text-xl rounded-md bg-black text-white">{props.title}</div>
        </Link>
    );
}

export function IntroScreen() {
    return (
        <div className="bg-white w-full h-full flex flex-col items-center justify-center rounded-b-md transition-all">
            <h1 className="text-2xl lg:text-4xl tracking-widest uppercase text-black mt-4 mb-8 z-10">
                Metacity Studio
            </h1>

            <div className="flex flex-row space-x-2 z-10">
                <AppButon title="Open Editor" app="/editor" />
            </div>
        </div>
    );
}
