import 'allotment/dist/style.css';

import { StyleNode } from '@utils/utils';

import { ColumnContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useApplyStyle } from '@shared/Context/hooks';
import { StyleHierarchy } from '@shared/Style/StyleHierarchy';

export function StyleSidePanel() {
    const applyStyle = useApplyStyle();

    const handlePick = (root: StyleNode, node: StyleNode) => {
        applyStyle(root, node);
    };

    return (
        <ColumnContainer>
            <StretchContainer>
                <ColumnContainer>
                    <PanelTitle title="Style Outline" />
                    <StyleHierarchy onValuePick={handlePick} />
                </ColumnContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
