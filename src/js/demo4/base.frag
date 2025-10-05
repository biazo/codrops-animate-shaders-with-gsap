uniform sampler2D uTexture;
uniform float uBlurAmount;

varying vec2 vUv;

vec4 kawaseBlur(sampler2D tex, vec2 uv, float offset) {
  vec2 texelSize = vec2(1.0) / vec2(textureSize(tex, 0));
  
  vec4 color = vec4(0.0);
  
  color += texture2D(tex, uv + vec2(offset, offset) * texelSize);
  color += texture2D(tex, uv + vec2(-offset, offset) * texelSize);
  color += texture2D(tex, uv + vec2(offset, -offset) * texelSize);
  color += texture2D(tex, uv + vec2(-offset, -offset) * texelSize);
  
  return color * 0.25;
}

vec4 multiPassKawaseBlur(sampler2D tex, vec2 uv, float blurStrength) {
  vec4 color = texture2D(tex, uv);
  
  vec4 blur1 = kawaseBlur(tex, uv, 1.0 + blurStrength * 0.5);
  vec4 blur2 = kawaseBlur(tex, uv, 2.0 + blurStrength);
  vec4 blur3 = kawaseBlur(tex, uv, 3.0 + blurStrength * 1.5);
  
  float t1 = smoothstep(0.0, 3.0, blurStrength);
  float t2 = smoothstep(3.0, 7.0, blurStrength);
  
  vec4 finalBlur = mix(blur1, blur2, t1);
  finalBlur = mix(finalBlur, blur2, t2);
  
  float mixFactor = smoothstep(0.0, 1.0, blurStrength);
  return mix(color, finalBlur, mixFactor);
}

void main() {
  vec4 color = multiPassKawaseBlur(uTexture, vUv, uBlurAmount);
  gl_FragColor = color;
}