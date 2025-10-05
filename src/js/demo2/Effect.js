import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { Raycaster } from 'three';

gsap.registerPlugin(Observer);

export default class Effect {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Store the currently intersected object
    this.intersected = null;

    // Raycaster for detecting intersections with 3D objects
    this.raycaster = new Raycaster();

    // Create a GSAP Observer to track pointer and touch movement
    this.observer = Observer.create({
      target: document.querySelector('.content__carousel'),
      type: 'touch,pointer',
      onMove: e => this.onMove(e),
      onHoverEnd: () => this.hoverOut(),
    });
  }

  hoverOut() {
    if (!this.intersected) return;

    // Stop any running tweens on the uMixFactor uniform
    gsap.killTweensOf(this.intersected.material.uniforms.uMixFactor);

    // Animate uMixFactor back to 0 smoothly
    gsap.to(this.intersected.material.uniforms.uMixFactor, {
      value: 0.0,
      duration: 0.5,
      ease: 'power3.out'
    });

    // Clear the intersected reference
    this.intersected = null;
  }

  onMove(e) {
    // Convert screen coordinates to normalized device coordinates (-1 to 1)
    const normCoords = {
      x: (e.x / window.innerWidth) * 2 - 1,
      y: -(e.y / window.innerHeight) * 2 + 1,
    };

    // Update raycaster with current pointer position and camera
    this.raycaster.setFromCamera(normCoords, this.camera);

    // Check for intersections with objects in the scene
    const [intersection] = this.raycaster.intersectObjects(this.scene.children);

    if (intersection) {
      // If an object is intersected, store a reference
      this.intersected = intersection.object;
      const { material } = intersection.object;

      // Animate uniforms to create a hover effect
      gsap.timeline()
        .set(material.uniforms.uMouse, { value: intersection.uv }, 0)
        .to(material.uniforms.uMixFactor, {
          value: 1.0,
          duration: 3,
          ease: 'power3.out'
        }, 0);
    } else {
      // If no object is intersected, reset
      this.hoverOut();
    }
  }
}
