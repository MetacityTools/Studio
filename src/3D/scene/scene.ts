import { Renderable } from '@3D/models/renderable';

export class Scene {
    objects: Renderable[] = [];
    add(object: Renderable) {
        this.objects.push(object);
    }
}
