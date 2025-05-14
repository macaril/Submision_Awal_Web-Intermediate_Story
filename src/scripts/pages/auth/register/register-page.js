import RegisterPresenter from './register-presenter';
import StoryApi from '../../../data/api.js';
import { generateLoaderAbsoluteTemplate } from '../../../templates.js';

export default class RegisterPage {
  #presenter;

  async render() {
    return `
      <section class="auth-section container">
        <h1 class="auth-title">Create an Account</h1>
        
        <div class="auth-container">
          <form id="register-form" class="auth-form">
            <div class="form-control">
              <label for="name-input" class="form-label">Name</label>
              <input 
                type="text" 
                id="name-input" 
                name="name" 
                class="form-input" 
                placeholder="Enter your name"
                required
                aria-describedby="name-input-info"
              >
              <div id="name-input-info" class="form-help">Your full name</div>
            </div>
            
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
              <div id="email-input-info" class="form-help">Your email address will be used for login</div>
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
                minlength="6"
                aria-describedby="password-input-info"
              >
              <div id="password-input-info" class="form-help">Password must be at least 6 characters</div>
            </div>
            
            <div id="register-error" class="form-error"></div>
            <div id="register-success" class="form-success"></div>
            
            <div class="form-actions">
              <span id="register-button-container">
                <button type="submit" class="btn btn-primary btn-block">Register</button>
              </span>
            </div>
            
            <div class="auth-links">
              <p>Already have an account? <a href="#/login">Login here</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryApi,
    });

    this.#setupForm();
  }

  #setupForm() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = form.elements.namedItem('name').value;
      const email = form.elements.namedItem('email').value;
      const password = form.elements.namedItem('password').value;

      await this.#presenter.register({ name, email, password });
    });
  }

  showLoading() {
    document.getElementById('register-button-container').innerHTML = `
      <button class="btn btn-primary btn-block" type="submit" disabled>
        <span class="loader-button"></span> Registering...
      </button>
    `;
  }

  hideLoading() {
    document.getElementById('register-button-container').innerHTML = `
      <button class="btn btn-primary btn-block" type="submit">Register</button>
    `;
  }

  showRegisterError(message) {
    const successElement = document.getElementById('register-success');
    successElement.textContent = '';
    successElement.classList.remove('visible');

    const errorElement = document.getElementById('register-error');
    errorElement.textContent = message || 'Registration failed. Please try again.';
    errorElement.classList.add('visible');

    errorElement.classList.add('shake');
    setTimeout(() => {
      errorElement.classList.remove('shake');
    }, 500);
  }

  registerSuccess(message) {
    const errorElement = document.getElementById('register-error');
    errorElement.textContent = '';
    errorElement.classList.remove('visible');

    const successElement = document.getElementById('register-success');
    successElement.textContent = message || 'Registration successful! You can now login.';
    successElement.classList.add('visible');

    document.getElementById('register-form').reset();

    setTimeout(() => {
      location.hash = '/login';
    }, 2000);
  }
}