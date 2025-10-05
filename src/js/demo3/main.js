import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from '../utils';
import Stage from './Stage';

gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

const carouselWrapper = document.querySelector('.content');
const carouselInnerRef = document.querySelector('.content__carousel-inner');

let scrollPos = 0;
const stage = new Stage(carouselWrapper);

const draggable = new Draggable(carouselInnerRef, {
  type: 'x',
  inertia: true,
  dragResistance: 0.5,
  edgeResistance: 0.5,
  throwResistance: 0.5,
  throwProps: true,
  onDrag() {
    const progress = gsap.utils.normalize(draggable.maxX, draggable.minX, draggable.x);
    scrollPos = scrollTriggerInstance.start + (scrollTriggerInstance.end - scrollTriggerInstance.start) * progress;

    scrollTriggerInstance.scroll(scrollPos);
  },
  onThrowUpdate() {
    const progress = gsap.utils.normalize(draggable.maxX, draggable.minX, draggable.x);
    scrollPos = scrollTriggerInstance.start + (scrollTriggerInstance.end - scrollTriggerInstance.start) * progress;

    scrollTriggerInstance.scroll(scrollPos);
  },
});

let maxScroll = Math.abs(Math.min(0, window.innerWidth - carouselInnerRef.scrollWidth));

const scrollTriggerInstance = ScrollTrigger.create({
  trigger: carouselWrapper,
  start: 'top top',
  end: `+=${2.5 * maxScroll}`,
  pin: true,
  scrub: 0.05,
  anticipatePin: 1,
  invalidateOnRefresh: true,
  onUpdate(e) {
    const x = -maxScroll * e.progress;

      gsap.set(carouselInnerRef, { x });
      draggable.x = x;
      draggable.update();
    }
});


gsap.ticker.add(stage.render.bind(stage));

function resize() {
  const innerWidth = carouselInnerRef.scrollWidth;
  const viewportWidth = window.innerWidth;
  maxScroll = Math.abs(Math.min(0, viewportWidth - innerWidth));

  draggable.applyBounds({ minX: -maxScroll, maxX: 0 });

  scrollTriggerInstance.refresh();

  stage.resize();
}

imagesLoaded(carouselInnerRef, resize);

window.addEventListener('resize', debounce(resize));