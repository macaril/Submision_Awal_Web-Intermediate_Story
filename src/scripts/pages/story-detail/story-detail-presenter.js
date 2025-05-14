export default class StoryDetailPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoryDetail(id) {
    if (!id) {
      this.#view.showStoryDetailError('Story ID is missing');
      return;
    }

    this.#view.showLoading();

    try {
      const response = await this.#model.getStoryDetail(id);

      if (!response.ok) {
        console.error('showStoryDetail: response:', response);
        this.#view.showStoryDetailError(response.message);
        return;
      }

      this.#view.showStoryDetail(response.data);

      if (response.data.lat && response.data.lon) {
        await this.showStoryLocationMap(response.data.lat, response.data.lon, response.data.name);
      }
    } catch (error) {
      console.error('showStoryDetail: error:', error);
      this.#view.showStoryDetailError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }

  async showStoryLocationMap(lat, lon, name) {
    this.#view.showMapLoading();
    try {
      await this.#view.initializeMap(lat, lon, name);
    } catch (error) {
      console.error('showStoryLocationMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }
}