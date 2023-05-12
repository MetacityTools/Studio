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
            <div>Metacity Studio</div>
            <div>Roadmap</div>
            <AppButon title="Editor" app="/editor" />
        </div>
    );
}
