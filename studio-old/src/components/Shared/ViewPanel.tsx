import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { ViewCameraGround } from './ViewCameraGround';
import { ViewShading } from './ViewShading';
import { ViewShowGrid } from './ViewShowGrid';

export function ViewPanel() {
    return (
        <ColumnContainer>
            <PanelTitle title="View Settings" />
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <div className="space-y-4 p-4">
                        <ViewShading />
                        <ViewCameraGround />
                        <ViewShowGrid />
                    </div>
                </OverflowAbsoluteContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
