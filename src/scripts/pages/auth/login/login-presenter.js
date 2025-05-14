export default class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async login({ email, password }) {
    this.#view.showLoading();

    try {
      const response = await this.#model.login(email, password);

      if (!response.ok) {
        this.#view.showLoginError(response.message);
        return;
      }

      this.#view.loginSuccess(response.data);
    } catch (error) {
      console.error('login: error:', error);
      this.#view.showLoginError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}