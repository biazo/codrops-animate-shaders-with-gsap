import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { Raycaster } from 'three';

export default class Effect {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.activeObject = null;

    // Initialize the Three.js raycaster for detecting object intersections
    this.raycaster = new Raycaster();

    // Set up GSAP Observer to listen for click or touch interactions
    this.observer = Observer.create({
      target: document.querySelector('.content__carousel'),
      type: 'touch,pointer',
      onClick: e => this.onClick(e),
    });
  }

  animate(material, userData, mouseCoords) {
    return gsap.timeline({
      defaults: { duration: 1.5, ease: 'power3.inOut' },

      // Update the uTime uniform continuously during the animation
      onUpdate() {
        material.uniforms.uTime.value += 0.1;
      },
    })
    // Set mouse UV coordinates in the shader
    .set(material.uniforms.uMouse, { value: mouseCoords }, 0)

    // Set the direction of the grayscale effect (1 for BW, -1 for color)
    .set(material.uniforms.uDirection, { value: userData.isBw ? 1.0 : -1.0 }, 0)

    // Animate grayscale progress from 0 to 1
    .fromTo(material.uniforms.uGrayscaleProgress, { value: 0 }, { value: 1 }, 0)

    // Animate a ripple effect using a keyframe sequence [0 → 1 → 0]
    .to(material.uniforms.uRippleProgress, { keyframes: { value: [0, 1, 0] } }, 0);
  }

  resetMaterial(object) {
    // Reset all shader uniforms to default values
    gsap.timeline({
      defaults: { duration: 1, ease: 'power2.out' },

      onUpdate() {
        object.material.uniforms.uTime.value += 0.1;
      },
      onComplete() {
        object.userData.isBw = false;
      }
    })
    .set(object.material.uniforms.uMouse, { value: { x: 0.5, y: 0.5} }, 0)
    .set(object.material.uniforms.uDirection, { value: 1.0 }, 0)
    .fromTo(object.material.uniforms.uGrayscaleProgress, { value: 1 }, { value: 0 }, 0)
    .to(object.material.uniforms.uRippleProgress, { keyframes: { value: [0, 1, 0] } }, 0);
  }
  

  onClick(e) {
    // Convert click coordinates to normalized device coordinates (-1 to 1)
    const normCoords = {
      x: (e.x / window.innerWidth) * 2 - 1,
      y: -(e.y / window.innerHeight) * 2 + 1,
    };

    // Set raycaster from the camera using the pointer's position
    this.raycaster.setFromCamera(normCoords, this.camera);

    // Get the first intersected object in the scene
    const [intersection] = this.raycaster.intersectObjects(this.scene.children);

    if (intersection) {
      const { material, userData } = intersection.object;

      if (this.activeObject) {
        this.resetMaterial(this.activeObject)

        // Stops timeline if active
        if (this.activeObject.userData.tl?.isActive()) this.activeObject.userData.tl.kill();
        
        // Cleans timeline
        this.activeObject.userData.tl = null;
      }

      // Setup active object
      this.activeObject = intersection.object;

      // Only trigger animation if one is not already active
      if (!userData.tl?.isActive()) {
        // Toggle isBw state (black and white mode)
        intersection.object.userData.isBw = !userData.isBw;

        // Store the animation timeline on the object to avoid overlapping animations
        userData.tl = this.animate(material, userData, intersection.uv);
      }
    }
  }
}
