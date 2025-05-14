export default class NewStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewStoryMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewStoryMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, photo, lat, lon }) {
    if (!description) {
      this.#view.showSubmitError('Please enter a description for your story');
      return;
    }

    if (!photo) {
      this.#view.showSubmitError('Please take a photo or upload an image for your story');
      return;
    }

    this.#view.showSubmitLoading();
    
    try {
      const data = {
        description,
        photo,
        lat,
        lon
      };
      
      const response = await this.#model.storeNewStory(data);

      if (!response.ok) {
        console.error('postNewStory: response:', response);
        this.#view.showSubmitError(response.message);
        return;
      }

      this.#view.storeSuccessfully(response.message);
    } catch (error) {
      console.error('postNewStory: error:', error);
      this.#view.showSubmitError(error.message);
    } finally {
      this.#view.hideSubmitLoading();
    }
  }
}