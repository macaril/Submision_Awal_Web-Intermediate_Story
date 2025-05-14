import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';

import App from './pages/app.js';
import Camera from './utils/camera.js';
import { setupSkipToContent } from './utils/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
    skipLinkButton: document.querySelector('#skip-link')
  });

  setupSkipToContent(
    document.querySelector('#skip-link'),
    document.querySelector('#main-content')
  );

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    Camera.stopAllStreams();
  });
});