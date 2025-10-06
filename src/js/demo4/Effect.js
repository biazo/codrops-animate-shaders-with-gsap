import { gsap } from 'gsap';
import { Vector3, MathUtils } from 'three';
import { debounce } from '../utils';

export default class Effect {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Get all child objects (tiles) from the scene
    this.tiles = scene.children;

    // Reference to the scroll update callback function
    this.callback = this.scrollUpdateCallback;

    // Center of the screen in X axes
    this.centerX = window.innerWidth / 2

    window.addEventListener('resize', debounce(() => this.centerX = window.innerWidth / 2));
  }

  scrollUpdateCallback() {
    this.tiles.forEach(tile => {
      // Project tile's 3D position to 2D screen space
      const worldPosition = tile.getWorldPosition(new Vector3());
      const vector = worldPosition.clone().project(this.camera);

      // Convert normalized device coordinates to screen coordinates (pixels)
      const screenX = (vector.x * 0.5 + 0.5) * window.innerWidth;

      // Calculate distance from the tile to the center of the screen
      const distance = Math.abs(screenX - this.centerX);

      // Maximum possible distance from center to corner of the screen
      const maxDistance = window.innerWidth / 2;

      // Normalize distance and scale to get blur amount (0.0 to 10.0)
      const blurAmount = MathUtils.clamp(distance / maxDistance * 20, 0.0, 20.0);

      // console.log('Distance:', distance, 'Blur:', blurAmount);

      // Animate the uBlurAmount uniform of the tile's material rounded to the nearest even number for a cleaner effect
      gsap.to(tile.material.uniforms.uBlurAmount, {
        value: Math.round(blurAmount / 2) * 2,
        duration: 0.5,
        ease: 'power3.out'
      });
    });
  }
}