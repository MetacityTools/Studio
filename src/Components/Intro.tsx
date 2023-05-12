import React from 'react';
import { Link } from 'react-router-dom';

import splash from '@assets/splash/bubny.png';

function AppButon(props: { title: string; app: string }) {
    return (
        <Link to={props.app}>
            <div className="px-8 py-4 text-xl hover:-translate-y-1 transition-all rounded-md hover:shadow-even border border-neutral-300">
                {props.title}
            </div>
        </Link>
    );
}

export function IntroScreen() {
    return (
        <div className="bg-white w-full h-[90%] flex flex-row max-w-[1000px] mx-auto">
            <div className="w-full h-full flex flex-col justify-center items-start">
                <div className="flex flex-col justify-center items-start p-4">
                    <h1 className="text-8xl mb-8 font-black text-neutral-400">Metacity Studio</h1>
                    <div className="mb-8">Load and view IFC, GLTF and SHP files</div>
                    <AppButon title="Open Studio" app="/editor" />
                </div>
            </div>
        </div>
    );
}
