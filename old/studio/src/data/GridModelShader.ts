import * as GL from '@bananagl/bananagl';

const vertexShader = `
in vec3 position;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
out vec4 fragColor;

void main() {
    fragColor = vec4(0.9, 0.9, 0.9, 0.8);
}
`;

export const shader = new GL.Shader(vertexShader, fragmentShader, false, false);
