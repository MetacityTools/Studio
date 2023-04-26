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
        <Link to="editor" className="flex flex-col items-center justify-center h-full">
            <div className="bg-white w-[80%] h-[80%] flex flex-col items-center justify-center rounded-b-md transition-all">
                <h1 className="text-2xl lg:text-4xl tracking-widest uppercase text-neutral-500 mt-4 mb-8">
                    Open Studio todo intro screen
                </h1>
            </div>
        </Link>
    );
}
