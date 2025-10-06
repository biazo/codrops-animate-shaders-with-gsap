import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { Raycaster } from 'three';

export default class Effect {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.active = null; // Currently active (pressed) object
    this.prevActive = null; // Prev active (pressed) object

    // Raycaster to detect pointer intersection with 3D objects
    this.raycaster = new Raycaster();

    // GSAP Observer listens for pointer/touch press, move, and release
    this.observer = Observer.create({
      target: document.querySelector('.content__carousel'),
      type: 'touch,pointer',
      onPress: e => this.onPress(e),
      onMove: e => this.onMove(e),
      onRelease: () => this.onRelease(),
    });

    // Continuously update the uTime uniform for the active object
    gsap.ticker.add(() => {
      if (this.active) {
        this.active.material.uniforms.uTime.value += 0.1;
      }
    });
  }

  resetState(obj) {
    obj.userData.isBw = !obj.userData.isBw;
    obj.material.uniforms.uDirection.value = obj.userData.isBw ? 1.0 : -1.0;
    obj.material.uniforms.uGrayscaleProgress.value = 0;
  } 

  resetMaterial(obj) {
    gsap.killTweensOf(obj.material.uniforms.uGrayscaleProgress);

    obj.material.uniforms.uDirection.value = 1.0;
    obj.material.uniforms.uMouse.value = { x: 0.5, y: 0.5};

    const tl = gsap.timeline({
      onComplete: () => this.resetState(obj)
    });

    tl.fromTo(obj.material.uniforms.uGrayscaleProgress, { value: 0.0 }, { value: 1.0 }, 0.3);
  }

  async onActiveEnter() {
    // Kill any ongoing grayscale animations
    gsap.killTweensOf(this.active.material.uniforms.uGrayscaleProgress);

    // Animate to grayscale value 0.35 over 1 second
    await gsap.fromTo(this.active.material.uniforms.uGrayscaleProgress, { value: 0.0 }, {
      value: 0.35,
      duration: 0.5,
    });

    if (this.prevActive && this.prevActive !== this.active && this.prevActive.userData.isBw) this.resetMaterial(this.prevActive)

    // Animate to full grayscale (1.0), then reset and toggle direction
    gsap.to(this.active.material.uniforms.uGrayscaleProgress, {
      value: 1,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out',
      onComplete: () => {
        this.resetState(this.active);

        this.prevActive = this.active;
      },
    });
  }

  onActiveLeve(mesh) {
    // Kill any ongoing grayscale animations
    gsap.killTweensOf(mesh.material.uniforms.uGrayscaleProgress);

    // Animate grayscale back to 0, and update uTime during the process
    gsap.to(mesh.material.uniforms.uGrayscaleProgress, {
      value: 0,
      onUpdate: () => {
        mesh.material.uniforms.uTime.value += 0.1;
      },
    });
  }

  getIntersection(e) {
    // Convert screen coordinates to normalized device coordinates (-1 to 1)
    const normCoords = {
      x: (e.x / window.innerWidth) * 2 - 1,
      y: -(e.y / window.innerHeight) * 2 + 1,
    };

    // Update the raycaster with pointer position and camera
    this.raycaster.setFromCamera(normCoords, this.camera);

    // Check for intersections with scene objects
    const [intersection] = this.raycaster.intersectObjects(this.scene.children);

    return intersection;
  }

  onPress(e) {
    const intersection = this.getIntersection(e);

    if (intersection) {
      this.active = intersection.object;

      // Start the grayscale transition animation
      this.onActiveEnter(this.active);
    }
  }

  onRelease() {
    if (this.active) {
      const prevActive = this.active;
      this.active = null;

      // Reset animation on the previously active object
      this.onActiveLeve(prevActive);
    }
  }

  onMove(e) {
    const intersection = this.getIntersection(e);

    if (intersection) {
      // Update shader uniform with current pointer UV coordinates
      const { material } = intersection.object;
      gsap.set(material.uniforms.uMouse, { value: intersection.uv });
    } else {
      // If pointer is not over an object anymore, release/reset
      this.onRelease();
    }
  }
}
