uniform sampler2D uTexture;
uniform float uBlurAmount;

varying vec2 vUv;

// Performs a single pass Kawase blur by sampling 4 neighboring pixels with a given offset
vec4 kawaseBlur(sampler2D tex, vec2 uv, float offset) {
  // Calculate the size of one texel (pixel) in UV coordinates
  vec2 texelSize = vec2(1.0) / vec2(textureSize(tex, 0));
  
  vec4 color = vec4(0.0);
  
  // Sample the texture at 4 offset positions around the current UV coordinate
  color += texture2D(tex, uv + vec2(offset, offset) * texelSize);
  color += texture2D(tex, uv + vec2(-offset, offset) * texelSize);
  color += texture2D(tex, uv + vec2(offset, -offset) * texelSize);
  color += texture2D(tex, uv + vec2(-offset, -offset) * texelSize);
  
  // Average the samples to get the blur color for this pass
  return color * 0.25;
}

// Combines multiple Kawase blur passes with increasing offsets to create a stronger blur effect
vec4 multiPassKawaseBlur(sampler2D tex, vec2 uv, float blurStrength) {
  // Original color without blur
  vec4 baseTexture = texture2D(tex, uv);
  
  // Perform three Kawase blur passes with different offsets scaled by blurStrength
  vec4 blur1 = kawaseBlur(tex, uv, 1.0 + blurStrength * 1.5);
  vec4 blur2 = kawaseBlur(tex, uv, 2.0 + blurStrength);
  vec4 blur3 = kawaseBlur(tex, uv, 3.0 + blurStrength * 2.5);
  
  // Calculate interpolation factors to smoothly blend between blur passes based on blurStrength
  float t1 = smoothstep(0.0, 3.0, blurStrength);
  float t2 = smoothstep(3.0, 7.0, blurStrength);
  
  // Blend blur passes progressively
  vec4 blurredTexture = mix(blur1, blur2, t1);
  blurredTexture = mix(blurredTexture, blur3, t2);
  
  // Calculate mix factor for blending the original and blurred colors
  float mixFactor = smoothstep(0.0, 1.0, blurStrength);
  
  // Return the final color, interpolating between original and blurred based on mixFactor
  return mix(baseTexture, blurredTexture, mixFactor);
}

void main() {
  // Apply multi-pass Kawase blur with the given blur amount
  vec4 color = multiPassKawaseBlur(uTexture, vUv, uBlurAmount);
  gl_FragColor = color;
}
