import { useRenderer, useScene } from '@utils/utils';

import { Vitals } from '@editor/Utils/Vitals';

import { Button } from '@elements/Button';

export function MetaMenu() {
    const renderer = useRenderer();
    const scene = useScene();

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b items-center">
            <Button>Export</Button>
            <Vitals scenes={[scene]} renderer={renderer} />
        </div>
    );
}
