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

    const setAllPerspective = () => {
        renderer.views.forEach((view) => {
            view.view.camera.projectionType = GL.ProjectionType.PERSPECTIVE;
        });
    };

    const setAllOrtho = () => {
        renderer.views.forEach((view) => {
            view.view.camera.projectionType = GL.ProjectionType.ORTHOGRAPHIC;
        });
    };

    return (
        <div className="absolute m-4 flex flex-row space-x-1">
            <MenuButton>
                <ModelInputButton onModelAdded={(models) => addUserModels(scene, models)} />
            </MenuButton>
            <MenuButton>
                <button onClick={setAllPerspective} className="p-2">
                    Perspective Camera
                </button>
            </MenuButton>
            <MenuButton>
                <button onClick={setAllOrtho} className="p-2">
                    Ortho Camera
                </button>
            </MenuButton>
        </div>
    );
}
