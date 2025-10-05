#define AMP 0.1
#define FREQ 8.0
#define PI 3.14159265359

varying vec2 vUv;
varying float vRipple;

uniform float uRippleProgress;
uniform float uTime;
uniform vec2 uMouse;

void main() {
  vec3 pos = position;

  float dist = distance(uv, uMouse);
  float decay = clamp(dist, 8.0, 10.0);
  float ripple = sin(-PI * FREQ * dist + uTime) * (AMP / decay);

  ripple *= uRippleProgress;
  pos.y += ripple;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vUv = uv;
  vRipple = ripple;
}