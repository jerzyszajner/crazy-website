import { mountArchiveView } from './views/archiveView.js';
import { getEntry } from '../content/archive.js';
import { setSelectedId } from './state.js';

const routes = {
  archive: /^#(\/(archiwum)?)?\/?$/,
  act: /^#\/akt\/([^/]+)\/?$/,
};

/** @type {null | { unmount: () => void }} */
let current = null;

function parseHash() {
  const raw = window.location.hash || '#/';
  const act = routes.act.exec(raw);
  if (act) {
    const id = decodeURIComponent(act[1]);
    return { name: 'act', id, hash: raw };
  }
  if (routes.archive.test(raw)) {
    return { name: 'archive', id: null, hash: raw };
  }
  return { name: 'archive', id: null, hash: raw };
}

function syncRouteToState() {
  const route = parseHash();
  if (route.name === 'act' && route.id) {
    const entry = getEntry(route.id);
    if (!entry) {
      window.location.hash = '#/';
      return;
    }
    setSelectedId(route.id);
    return;
  }
  setSelectedId(null);
}

function render() {
  const root = document.getElementById('app');
  if (!root) return;

  syncRouteToState();

  if (!current) {
    current = mountArchiveView(root, {
      onNavigateToAct(id) {
        window.location.hash = `#/akt/${encodeURIComponent(id)}`;
      },
      onNavigateHome() {
        window.location.hash = '#/';
      },
    });
  }
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  render();
}

export function stopRouter() {
  window.removeEventListener('hashchange', render);
  if (current) {
    current.unmount();
    current = null;
  }
}
