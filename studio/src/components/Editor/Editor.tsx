import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import clsx from 'clsx';

import { ProcessingScreen } from '@elements/Processing';
import { SizeGuard } from '@elements/SizeGuard';

import { CanvasComponent } from '@shared/CanvasComponent';
import { useDarkmode } from '@shared/Context/hooks';
import { Controls } from '@shared/Controls';

import { Help } from './Canvas/Help';
import { EditorSpash } from './EditorSplash';
import { SidePanel } from './SidePanel/SidePanel';

export function ModelEditor() {
    const [darkmode] = useDarkmode();
    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <div className={clsx('w-full h-full', darkmode && 'dark')}>
                <Allotment separator={false}>
                    <Allotment.Pane
                        preferredSize={500}
                        snap
                        className="border-r mc-border mc-background transition-colors"
                    >
                        <SidePanel />
                    </Allotment.Pane>
                    <Allotment.Pane minSize={200} className="bg-neutral-100">
                        <CanvasComponent />
                        <Help />
                        <Controls />
                    </Allotment.Pane>
                </Allotment>
                <ProcessingScreen />
                <EditorSpash />
            </div>
        </SizeGuard>
    );
}
