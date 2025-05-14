import LoginPresenter from './login-presenter';
import StoryApi from '../../../data/api';
import { putAccessToken, putUserData } from '../../../utils/auth';
import { generateLoaderAbsoluteTemplate } from '../../../templates';

export default class LoginPage {
  #presenter;

  async render() {
    return `
      <section class="auth-section container">
        <h1 class="auth-title">Login to Your Account</h1>
        
        <div class="auth-container">
          <form id="login-form" class="auth-form">
            <div class="form-control">
              <label for="email-input" class="form-label">Email</label>
              <input 
                type="email" 
                id="email-input" 
                name="email" 
                class="form-input" 
                placeholder="Enter your email"
                required
                aria-describedby="email-input-info"
              >
              <div id="email-input-info" class="form-help">Enter the email address you registered with</div>
            </div>
            
            <div class="form-control">
              <label for="password-input" class="form-label">Password</label>
              <input 
                type="password" 
                id="password-input" 
                name="password" 
                class="form-input" 
                placeholder="Enter your password"
                required
                aria-describedby="password-input-info"
              >
              <div id="password-input-info" class="form-help">Enter your password</div>
            </div>
            
            <div id="login-error" class="form-error"></div>
            
            <div class="form-actions">
              <span id="login-button-container">
                <button type="submit" class="btn btn-primary btn-block">Login</button>
              </span>
            </div>
            
            <div class="auth-links">
              <p>Don't have an account? <a href="#/register">Register here</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryApi,
    });

    this.#setupForm();
  }

  #setupForm() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = form.elements.namedItem('email').value;
      const password = form.elements.namedItem('password').value;

      await this.#presenter.login({ email, password });
    });
  }

  showLoading() {
    document.getElementById('login-button-container').innerHTML = `
      <button class="btn btn-primary btn-block" type="submit" disabled>
        <span class="loader-button"></span> Logging in...
      </button>
    `;
  }

  hideLoading() {
    document.getElementById('login-button-container').innerHTML = `
      <button class="btn btn-primary btn-block" type="submit">Login</button>
    `;
  }

  showLoginError(message) {
    const errorElement = document.getElementById('login-error');
    errorElement.textContent = message || 'Login failed. Please check your credentials.';
    errorElement.classList.add('visible');

    errorElement.classList.add('shake');
    setTimeout(() => {
      errorElement.classList.remove('shake');
    }, 500);
  }

  loginSuccess(userData) {
    putAccessToken(userData.token);
    putUserData({
      id: userData.userId,
      name: userData.name,
    });

    location.hash = '/';
  }
}