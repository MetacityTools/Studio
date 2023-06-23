import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { OverflowContainer } from '@elements/Containers';

import { ModelList } from './ModelList/ModelList';
import { Modifiers } from './Modifiers/Modifiers';

export function TransformSidePanel() {
    return (
        <Allotment separator={false} vertical>
            <Allotment.Pane minSize={200} preferredSize={300}>
                <ModelList />
            </Allotment.Pane>
            <Allotment.Pane minSize={200} className="border-t">
                <OverflowContainer>
                    <Modifiers />
                </OverflowContainer>
            </Allotment.Pane>
        </Allotment>
    );
}
