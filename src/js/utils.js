import { Vector3 } from 'three';

const preloadImages = (selector = 'img') => {
  return new Promise((resolve) => imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve));
};

const getWorldPositionFromDOM = (element, camera, renderer) => {
  const rect = element.getBoundingClientRect();
  const canvasRect = renderer.domElement.getBoundingClientRect();

  // Center of DOM element inside canvas (normalized -1..1)
  const x = ((rect.left + rect.width / 2) - canvasRect.left) / canvasRect.width * 2 - 1;
  const y = -(((rect.top + rect.height / 2) - canvasRect.top) / canvasRect.height * 2 - 1);

  const vector = new Vector3(x, y, 0); 
  vector.unproject(camera);

  return vector;
}

export const debounce = (callback, delay = 250) => {
  let timeoutID;

  return (...args) => {
    clearTimeout(timeoutID);

    timeoutID = setTimeout(() => {
      timeoutID = null;
      callback(...args);
    }, delay);
  };
};

export { preloadImages, getWorldPositionFromDOM };