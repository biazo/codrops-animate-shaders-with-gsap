import { ShaderMaterial, Vector2 } from 'three';
import baseVertex from './base.vert?raw';
import baseFragment from './base.frag?raw';

export default class PlanesMaterial extends ShaderMaterial {
  constructor(texture) {
    super({
      vertexShader: baseVertex,
      fragmentShader: baseFragment,
      uniforms: {
        uGrayscaleProgress: { value: 0 },
        uRippleProgress: { value: 0 },
        uTime: { value: 0 },
        uDirection: { value: 1 },
        uMouse: { value: new Vector2(0.5, 0.5) },
        uTexture: { value: texture },
      },
    });
  }
}