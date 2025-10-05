uniform sampler2D uTexture;
uniform sampler2D uTextureBack;
uniform float uMixFactor;
uniform vec2 uMouse;
uniform float uAspect;
varying vec2 vUv;

void main() {
    vec2 correctedUv = vec2(vUv.x, (vUv.y - 0.5) * uAspect + 0.5);
    vec2 correctedMouse = vec2(uMouse.x, (uMouse.y - 0.5) * uAspect + 0.5);

    float distance = length(correctedUv - correctedMouse);
    float influence = 1.0 - smoothstep(0.0, 0.5, distance);
    float finalMix = uMixFactor * influence;

    vec4 textureFront = texture2D(uTexture, vUv);
    vec4 textureBack = texture2D(uTextureBack, vUv);

    vec4 finalColor = mix(textureFront, textureBack, finalMix);
    gl_FragColor = finalColor;
}
