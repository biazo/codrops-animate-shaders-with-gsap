uniform sampler2D uTexture;
uniform sampler2D uTextureBack;
uniform float uMixFactor;
uniform vec2 uMouse;
uniform float uAspect;

varying vec2 vUv;

void main() {
    vec2 correctedUv = vec2(vUv.x, (vUv.y - 0.5) * uAspect + 0.5);
    vec2 correctedMouse = vec2(uMouse.x, (uMouse.y - 0.5) * uAspect + 0.5);

    // Calculate the distance from the current fragment to the mouse position
    float distance = length(correctedUv - correctedMouse);

    // Create a localized influence based on distance using smoothstep. Influence is strongest (1.0) at the mouse center, and fades to 0.0 outward
    float influence = 1.0 - smoothstep(0.0, 0.5, distance);

    // Modulate the global mix factor by the local influence
    float finalMix = uMixFactor * influence;

    // Sample both front and back textures using original UVs
    vec4 textureFront = texture2D(uTexture, vUv);
    vec4 textureBack = texture2D(uTextureBack, vUv);

    // Blend the two textures based on the final mix factor
    vec4 finalColor = mix(textureFront, textureBack, finalMix);

    // Output the final color to the screen
    gl_FragColor = finalColor;
}
