import { ShaderMaterial, Vector2 } from 'three';
import baseVertex from './base.vert?raw';
import baseFragment from './base.frag?raw';

export default class PlanesMaterial extends ShaderMaterial {
  constructor(texture, textureBack, imageRatio) {
    super({
      vertexShader: baseVertex,
      fragmentShader: baseFragment,
      uniforms: {
        uTexture: { value: texture },
        uTextureBack: { value: textureBack },
        uMixFactor: { value: 0.0 },
        uAspect: { value: imageRatio },
        uMouse: { value: new Vector2(0.5, 0.5) },
      },
    });
  }
}