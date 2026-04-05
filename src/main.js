import './styles/main.css';
import { initLocaleFromStorage } from './app/state.js';
import { startRouter } from './app/router.js';

initLocaleFromStorage();

function applyReducedMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  function sync() {
    document.documentElement.classList.toggle('reduce-motion', mq.matches);
  }
  sync();
  mq.addEventListener('change', sync);
}

applyReducedMotion();
startRouter();
