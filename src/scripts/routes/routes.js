import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import NewStoryPage from '../pages/story/new-story-page';

const routes = {
  '/': () => new HomePage(),
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/new': () => checkAuthenticatedRoute(new NewStoryPage()),
  '/about': () => new AboutPage(),
};

export default routes;