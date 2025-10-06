import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from '../utils';
import Stage from './Stage';

gsap.registerPlugin(Draggable, InertiaPlugin, ScrollTrigger);

const carouselWrapper = document.querySelector('.content');
const carouselInnerRef = document.querySelector('.content__carousel-inner');

const stage = new Stage(carouselWrapper);

gsap.ticker.add(stage.render.bind(stage));

function resize() {
  stage.resize();
}

imagesLoaded(carouselInnerRef, resize);

window.addEventListener('resize', debounce(resize));