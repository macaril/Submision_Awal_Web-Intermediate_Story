export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async register({ name, email, password }) {
    this.#view.showLoading();

    try {
      const response = await this.#model.register(name, email, password);

      if (response.error) {
        this.#view.showRegisterError(response.message);
        return;
      }

      this.#view.registerSuccess(response.message);
    } catch (error) {
      console.error('register: error:', error);
      this.#view.showRegisterError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}