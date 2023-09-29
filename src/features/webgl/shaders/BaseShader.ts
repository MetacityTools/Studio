export const vs = `
in vec3 position;
in vec3 color;

out vec3 oColor;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

void main() {
    oColor = color;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
}
`;

export const fs = `
in vec3 oColor;

out vec4 fragColor;

void main() {
    fragColor = vec4(oColor, 1.0);
}
`;
