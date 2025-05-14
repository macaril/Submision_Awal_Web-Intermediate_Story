import routes from '../routes/routes';
import { getActiveRoute, parseActivePathname } from '../routes/url-parser';
import { getAccessToken, logout } from '../utils/auth';
import { setupSkipToContent, transitionHelper } from '../utils';
import { generateAuthenticatedNavigationListTemplate, generateUnauthenticatedNavigationListTemplate } from '../templates';

export default class App {
  #content;
  #drawerButton;
  #navigationDrawer;
  #skipLinkButton;

  constructor({ content, drawerButton, navigationDrawer, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;
    
    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
      
      const isExpanded = this.#navigationDrawer.classList.contains('open');
      this.#drawerButton.setAttribute('aria-expanded', isExpanded);
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#navigationDrawer.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', 'false');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
          this.#drawerButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navList = document.getElementById('nav-list');

    if (!isLogin) {
      navList.innerHTML = `
        <li><a href="#/">Home</a></li>
        <li><a href="#/about">About</a></li>
        ${generateUnauthenticatedNavigationListTemplate()}
      `;
      return;
    }

    navList.innerHTML = `
      <li><a href="#/">Home</a></li>
      <li><a href="#/about">About</a></li>
      ${generateAuthenticatedNavigationListTemplate()}
    `;

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (confirm('Are you sure you want to log out?')) {
        logout();
        location.hash = '/login';
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const urlParams = parseActivePathname();
    
    let page;
    if (url === '/stories/:id') {
      const StoryDetailPage = routes[url]();
      page = StoryDetailPage;
      page.id = urlParams.id;
    } else {
      const routeHandler = routes[url];
      if (!routeHandler) {
        location.hash = '/';
        return;
      }
      
      page = routeHandler();

      if (!page) return;
    }

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      },
    });
    
    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'smooth' });
      this.#setupNavigationList();
    });
  }
}