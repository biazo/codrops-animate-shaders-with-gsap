import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import { getWorldPositionFromDOM } from '../utils';
import PlanesMaterial from './PlanesMaterial';
import Effect from './Effect';

export default class Stage {
  constructor(container) {
    this.container = container;

    this.DOMElements = [...this.container.querySelectorAll('img')];

    this.renderer = new WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.classList.add('content__canvas');

    this.container.appendChild(this.renderer.domElement);

    this.scene = new Scene();

    const { innerWidth: width, innerHeight: height } = window;
    this.camera = new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -1000, 1000);
    this.camera.position.z = 10;

    this.setUpPlanes();
    this.effect = this.initEffect();
  }

  setUpPlanes() {
    this.DOMElements.forEach((image) => {
      this.scene.add(this.generatePlane(image));
    });
  }

  generatePlane(image, ) {
    const loader = new TextureLoader();
    const texture = loader.load(image.src);

    texture.colorSpace = SRGBColorSpace;
    const plane = new Mesh(
      new PlaneGeometry(1, 1, 50, 50),
      new PlanesMaterial(texture),
    );

    return plane;
  }

  initEffect() {
    return new Effect(this.scene, this.camera);
  }

  resize() {
    // Update camera props to fit the canvas size
    const { innerWidth: screenWidth, innerHeight: screenHeight } = window;

    this.camera.left = -screenWidth / 2;
    this.camera.right = screenWidth / 2;
    this.camera.top = screenHeight / 2;
    this.camera.bottom = -screenHeight / 2;
    this.camera.updateProjectionMatrix();

    // Update also planes sizes
    this.DOMElements.forEach((image, index) => {
      const { width: imageWidth, height: imageHeight } = image.getBoundingClientRect();
      this.scene.children[index].scale.set(imageWidth, imageHeight, 1);
    });

    // Update the render using the window sizes
    this.renderer.setSize(screenWidth, screenHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    // For each plane and each image update the position of the plane to match the DOM element position on page
    this.DOMElements.forEach((image, index) => {
      this.scene.children[index].position.copy(getWorldPositionFromDOM(image, this.camera));
    });
  }
}