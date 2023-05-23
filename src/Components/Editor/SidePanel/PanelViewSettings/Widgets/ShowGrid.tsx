import React from 'react';
import { MdOutlineGrid3X3 } from 'react-icons/md';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '@components/Editor/Context';
import { EditorViewerContext } from '@components/Editor/Context';

import { Input } from '@elements/Input';
import { DetailWidget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function ShowGridWidget() {
    const ctx = React.useContext(EditorContext);
    const viewerCtx = React.useContext(EditorViewerContext);
    const { scene } = ctx;
    const { gridVisible, setGridVisible } = viewerCtx;

    const toggle = () => {
        setGridVisible(!gridVisible);
        scene.objects.forEach((object) => {
            if (object instanceof GL.Model && object.data.type === 'editor_internal_grid') {
                object.visible = !gridVisible;
            }
        });
    };

    return (
        <DetailWidget>
            <WidgetLine>
                <WidgetTitle>
                    <MdOutlineGrid3X3 className="mr-2" />
                    Grid Visibility
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Change the visibility of the grid</WidgetDescription>
            </WidgetLine>
            <WidgetLine className="px-4 mb-4">
                <Input
                    type="checkbox"
                    className="accent-neutral-500 transition-color mr-4"
                    checked={gridVisible}
                    onChange={() => toggle()}
                />{' '}
                Grid is {gridVisible ? 'visible' : 'hidden'}
            </WidgetLine>
        </DetailWidget>
    );
}
