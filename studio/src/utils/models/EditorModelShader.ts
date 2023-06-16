import * as GL from '@bananagl/bananagl';

const vertexShader = `
in vec3 position;
in vec3 normal;
in vec3 color;
in float barCoord;

const vec3 lightDirection = normalize(vec3(0.25, 0.25, 1.0));
out vec3 oColor; 
out vec3 oVbc;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uCameraPosition;
uniform vec3 uCameraTarget;

uniform float uZMin;
uniform float uZMax;


void main() {
    vec3 transformed = (uModelMatrix * vec4(position, 1.0)).xyz;
    vec3 invNormal = -normal;
    vec3 direction = normalize(uCameraPosition - uCameraTarget);
    float factorA = dot(normal, lightDirection);
    float factorB = dot(invNormal, lightDirection);

    float factor = max(factorA, factorB);
    oColor = vec3(factor) * 0.2 + vec3(0.7);
    oColor *= mix(vec3(0.5), vec3(1.0), smoothstep(uZMin, uZMax, transformed.z));
    oColor *= color;
    
    int b = int(barCoord);
    if (b == 0) oVbc = vec3(1.0, 0.0, 0.0);
    else if (b == 1) oVbc = vec3(0.0, 1.0, 0.0);
    else if (b == 2) oVbc = vec3(0.0, 0.0, 1.0);


    gl_Position = uProjectionMatrix * uViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
in vec3 oColor;
in vec3 oVbc;

out vec4 fragColor;

const float lineWidth = 0.5;
const vec3 lineColor = vec3(0.2);

float edgeFactor() {
    vec3 d = fwidth(oVbc);
    vec3 f = step(d * lineWidth, oVbc);
    return min(min(f.x, f.y), f.z);
}

void main() {
    float edge = edgeFactor();
    vec3 eColor = vec3(mix(0.9, 1.0, edge));
    fragColor = vec4(eColor * oColor, 1.0);
}
`;

export const solidShader = new GL.Shader(vertexShader, fragmentShader);

const wvertexShader = `
in vec3 normal;
in vec3 position;
in vec3 color;
in vec4 submodel;
in float selected;
in float barCoord;

const vec3 lightDirection = normalize(vec3(0.25, 0.25, 1.0));
out vec3 oColor; 
out float oSelected;
out vec3 oVbc;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uCameraPosition;
uniform vec3 uCameraTarget;

uniform float uZMin;
uniform float uZMax;


void main() {
    vec3 transformed = (uModelMatrix * vec4(position, 1.0)).xyz;
    vec3 invNormal = -normal;
    vec3 direction = normalize(uCameraPosition - uCameraTarget);
    float factorA = dot(normal, lightDirection);
    float factorB = dot(invNormal, lightDirection);

    float factor = max(factorA, factorB);
    oColor = vec3(factor) * 0.2 + vec3(0.7);
    oColor *= mix(vec3(0.5), vec3(1.0), smoothstep(uZMin, uZMax, transformed.z));
    oColor *= color;
    
    int b = int(barCoord);
    if (b == 0) oVbc = vec3(1.0, 0.0, 0.0);
    else if (b == 1) oVbc = vec3(0.0, 1.0, 0.0);
    else if (b == 2) oVbc = vec3(0.0, 0.0, 1.0);
    oSelected = selected;

    gl_Position = uProjectionMatrix * uViewMatrix * vec4(transformed, 1.0);
}
`;

const wfragmentShader = `
in vec3 oColor;
in vec3 oVbc;
in float oSelected;

out vec4 fragColor;

const float lineWidth = 0.5;
const vec3 lineColor = vec3(0.2);

float edgeFactor() {
    vec3 d = fwidth(oVbc);
    vec3 f = step(d * lineWidth, oVbc);
    return min(min(f.x, f.y), f.z);
}

void main() {
    float edge = edgeFactor(); //0 if outside, 1 if inside
    vec3 eColor = vec3(mix(0.9, 1.0, edge));
    float transp = mix(0.05, 0.2, 1.0 - edge);
    transp = mix(transp, 0.5, step(2.0, oSelected + 1.0 - edge));
    fragColor = vec4(eColor * oColor, transp);
}
`;

export const wireframeShader = new GL.Shader(wvertexShader, wfragmentShader, true);

const svertexShader = `
in vec3 normal;
in vec3 position;
in vec3 color;

const vec3 lightDirection = normalize(vec3(0.25, 0.25, 1.0));
out vec3 oColor; 

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uCameraPosition;
uniform vec3 uCameraTarget;

uniform float uZMin;
uniform float uZMax;


void main() {
    vec3 transformed = (uModelMatrix * vec4(position, 1.0)).xyz;
    vec3 invNormal = -normal;
    vec3 direction = normalize(uCameraPosition - uCameraTarget);
    float factorA = dot(normal, lightDirection);
    float factorB = dot(invNormal, lightDirection);

    float factor = max(factorA, factorB);
    //the weight of the 
    oColor = vec3(factor) * 0.1 + vec3(0.8);
    oColor *= mix(vec3(0.5), vec3(1.0), smoothstep(uZMin, uZMax, transformed.z));
    oColor *= color;

    gl_Position = uProjectionMatrix * uViewMatrix * vec4(transformed, 1.0);
}
`;

const sfragmentShader = `
in vec3 oColor;

out vec4 fragColor;

void main() {
    fragColor = vec4(oColor, 1.0);
}
`;

export const noEdgesShader = new GL.Shader(svertexShader, sfragmentShader);
