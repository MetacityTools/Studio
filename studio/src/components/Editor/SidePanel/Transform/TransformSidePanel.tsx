import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { TransformMenu } from './Menu/TransformMenu';
import { ModelList } from './ModelList/ModelList';
import { Modifiers } from './Modifiers/Modifiers';

export function TransformSidePanel() {
    return (
        <>
            <TransformMenu />
            <Allotment separator={false} vertical>
                <Allotment.Pane minSize={200} preferredSize={300}>
                    <ModelList />
                </Allotment.Pane>
                <Allotment.Pane minSize={200} className="flex flex-col border-t border-neutral-200">
                    <div className="overflow-x-auto w-full h-full">
                        <Modifiers />
                    </div>
                </Allotment.Pane>
            </Allotment>
        </>
    );
}
