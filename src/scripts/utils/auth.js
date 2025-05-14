import { getActiveRoute } from '../routes/url-parser';

const ACCESS_TOKEN_KEY = 'storyAccessToken';
const USER_DATA_KEY = 'storyUserData';

export function getAccessToken() {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken === 'null' || accessToken === 'undefined') {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('getAccessToken: error:', error);
    return null;
  }
}

export function putAccessToken(token) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('putAccessToken: error:', error);
    return false;
  }
}

export function getUserData() {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (userData === 'null' || userData === 'undefined') {
      return null;
    }

    return JSON.parse(userData);
  } catch (error) {
    console.error('getUserData: error:', error);
    return null;
  }
}

export function putUserData(userData) {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('putUserData: error:', error);
    return false;
  }
}

export function removeUserSession() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    return true;
  } catch (error) {
    console.error('removeUserSession: error:', error);
    return false;
  }
}

const unauthenticatedRoutesOnly = ['/login', '/register'];

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = '/';
    return null;
  }

  return page;
}

export function checkAuthenticatedRoute(page) {
  const isLogin = !!getAccessToken();

  if (!isLogin) {
    location.hash = '/login';
    return null;
  }

  return page;
}

export function logout() {
  removeUserSession();
}