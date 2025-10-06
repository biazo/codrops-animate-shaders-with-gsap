import { Vector3 } from 'three';

const preloadImages = (selector = 'img') => {
  return new Promise((resolve) => imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve));
};

const getWorldPositionFromDOM = (element, camera) => {
  const rect = element.getBoundingClientRect();

  const xNDC = (rect.left + rect.width / 2) / window.innerWidth * 2 - 1;
  const yNDC = -((rect.top + rect.height / 2) / window.innerHeight * 2 - 1);

  const xWorld = xNDC * (camera.right - camera.left) / 2;
  const yWorld = yNDC * (camera.top - camera.bottom) / 2;

  return new Vector3(xWorld, yWorld, 0);
};


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