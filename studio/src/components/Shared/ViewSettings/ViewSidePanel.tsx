import React from 'react';
import { GoSettings } from 'react-icons/go';

import { MenuButton, MenuGroup } from '@elements/Button';
import {
    ColumnContainer,
    OverflowAbsoluteContainer,
    OverflowContainer,
    StretchContainer,
} from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { CameraGroundWidget } from './WidgetCameraGround';
import { ShadingWidget } from './WidgetShading';
import { ShowGridWidget } from './WidgetShowGrid';

export function ViewSidePanel() {
    return (
        <ColumnContainer>
            <PanelTitle title="View Settings" />
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <div className="space-y-4 p-4">
                        <ShadingWidget />
                        <CameraGroundWidget />
                        <ShowGridWidget />
                    </div>
                </OverflowAbsoluteContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
