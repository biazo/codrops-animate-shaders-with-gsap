import { ShaderMaterial } from 'three';
import baseVertex from './base.vert?raw';
import baseFragment from './base.frag?raw';

export default class PlanesMaterial extends ShaderMaterial {
  constructor(texture) {
    super({
      vertexShader: baseVertex,
      fragmentShader: baseFragment,
      uniforms: {
        uTexture: { value: texture },
        uBlurAmount: { value: 0.0 },
      },
    });
  }
}