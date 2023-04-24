import { unitQuad } from '@utils/geometry/quad';

import * as GL from '@bananagl/bananagl';

const vertexShader = `
in vec3 position;
in vec3 shift;
in float color;

out vec3 oColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 uScreenSize;

const vec2 size = vec2(5.0, 5.0);

void main(){
    vec3 transformed = shift;
	gl_Position = uProjectionMatrix * (uViewMatrix * (uModelMatrix * vec4(transformed, 1.0)));
    gl_Position /= gl_Position.w;
    gl_Position.xy += position.xy * size / vec2(uScreenSize.x, uScreenSize.y);

    oColor = vec3(color);
}`;

const fragmentShader = `
in vec3 oColor;

out vec4 fragColor;

void main() {
    if (oColor.x > 0.5) discard;

	fragColor = vec4(oColor, 0.05);
}`;

const pointcloudShader = new GL.Shader(vertexShader, fragmentShader);

export function addPointcloudModel(shift: Float32Array, colors: Uint8Array, scene: GL.Scene) {
    const position = unitQuad();

    const model = new GL.Model();
    model.attributes.add(new GL.Attribute('position', new GL.Buffer(position), 3));
    model.attributes.add(new GL.InstancedAttribute('shift', new GL.Buffer(shift), 3, 1));
    model.attributes.add(new GL.InstancedAttribute('color', new GL.Buffer(colors), 1, 1, true));

    model.shader = pointcloudShader;

    scene.add(model);
    return model;
}
