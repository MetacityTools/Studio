import { addUserModels } from '@utils/geometry/userModel';

import * as GL from '@bananagl/bananagl';

import { MenuButton } from '@elements/MenuButton';

import { ModelInputButton } from './Input';

interface EditorMenuProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
}

export function EditorMenu(props: EditorMenuProps) {
    const { scene, renderer } = props;

    return (
        <div className="absolute m-4">
            <MenuButton>
                <ModelInputButton onModelAdded={(models) => addUserModels(scene, models)} />
            </MenuButton>
        </div>
    );
}
