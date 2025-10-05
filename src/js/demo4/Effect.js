import { gsap } from 'gsap';
import { Vector2, MathUtils } from 'three';

export default class Effect {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Get all child objects (tiles) from the scene
    this.tiles = scene.children;

    // Reference to the scroll update callback function
    this.callback = this.scrollUpdateCallback;

    // Center of the screen in 2D coordinates
    this.center = new Vector2(window.innerWidth / 2, window.innerHeight / 2);

    window.addEventListener('resize', () => {
      this.center.set(window.innerWidth / 2, window.innerHeight / 2);
    });
  }

  scrollUpdateCallback() {
    this.tiles.forEach(tile => {
      // Project tile's 3D position to 2D screen space
      const vector = tile.position.clone().project(this.camera);

      // Convert normalized device coordinates to screen coordinates (pixels)
      const screenX = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const screenY = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

      // Calculate distance from the tile to the center of the screen
      const distance = this.center.distanceTo(new Vector2(screenX, screenY));

      // Maximum possible distance from center to corner of the screen
      const maxDistance = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 2;

      // Normalize distance and scale to get blur amount (0.0 to 10.0)
      const blurAmount = MathUtils.clamp(distance / maxDistance * 10, 0.0, 10.0);

      // Animate the uBlurAmount uniform of the tile's material rounded to the nearest even number for a cleaner effect
      gsap.to(tile.material.uniforms.uBlurAmount, {
        value: Math.round(blurAmount / 2) * 2,
        duration: 0.5,
        ease: 'power3.out'
      });
    });
  }
}
