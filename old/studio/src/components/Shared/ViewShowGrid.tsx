import { MdOutlineGrid3X3 } from 'react-icons/md';

import { Input } from '@elements/Input';
import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

import { GridModel } from '@data/GridModel';

import { useGridVisible } from '@hooks/useGridVisible';
import { useScene } from '@hooks/useScene';

export function ViewShowGrid() {
    const scene = useScene();
    const [gridVisible, setGridVisible] = useGridVisible();

    const toggle = () => {
        setGridVisible(!gridVisible);
        scene.objects.forEach((object) => {
            if (object instanceof GridModel) {
                object.visible = !gridVisible;
            }
        });
    };

    return (
        <Widget>
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
                    className="accent-neutral-500 mr-4"
                    checked={gridVisible}
                    onChange={() => toggle()}
                />{' '}
                Grid is {gridVisible ? 'visible' : 'hidden'}
            </WidgetLine>
        </Widget>
    );
}
