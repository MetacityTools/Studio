import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { ColumnContainer, OverflowContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { ModelList } from './ModelList/ModelList';
import { Modifiers } from './Modifiers/Modifiers';

export function TransformSidePanel() {
    return (
        <Allotment separator={false} vertical>
            <Allotment.Pane minSize={20} preferredSize={400}>
                <ColumnContainer>
                    <PanelTitle title="Models" />
                    <ModelList />
                </ColumnContainer>
            </Allotment.Pane>
            <Allotment.Pane minSize={20} preferredSize={400} className="border-t">
                <ColumnContainer>
                    <PanelTitle title="Modifiers" />
                    <OverflowContainer>
                        <Modifiers />
                    </OverflowContainer>
                </ColumnContainer>
            </Allotment.Pane>
        </Allotment>
    );
}
