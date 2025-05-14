import StoryDetailPresenter from './story-detail-presenter';
import StoryApi from '../../data/api';
import Map from '../../utils/map';
import { generateLoaderAbsoluteTemplate, generateStoryDetailTemplate, generateStoryDetailErrorTemplate } from '../../templates';

export default class StoryDetailPage {
  #presenter;
  #map = null;
  id = null;

  async render() {
    return `
      <section class="container story-detail-section">
        <a href="#/" class="back-link">
          <i class="fas fa-arrow-left" aria-hidden="true"></i> Back to Stories
        </a>
        
        <div id="story-detail-container" class="story-detail-container">
          <div id="story-detail-loading-container" class="story-detail-loading-container">
            ${generateLoaderAbsoluteTemplate()}
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter({
      view: this,
      model: StoryApi,
    });

    await this.#presenter.showStoryDetail(this.id);
  }

  showStoryDetail(story) {
    document.getElementById('story-detail-container').innerHTML = generateStoryDetailTemplate(story);
  }

  showStoryDetailError(message) {
    document.getElementById('story-detail-container').innerHTML = generateStoryDetailErrorTemplate(message);
  }

  async initializeMap(lat, lon, name) {
    const mapContainer = document.getElementById('story-detail-map');
    if (!mapContainer) return;

    this.#map = await Map.build('#story-detail-map', {
      zoom: 15,
      center: [lat, lon],
    });

    const popupContent = `<strong>${name}'s Story Location</strong>`;
    this.#map.addMarker([lat, lon], {}, { content: popupContent });
  }

  showLoading() {
    const loadingContainer = document.getElementById('story-detail-loading-container');
    if (loadingContainer) {
      loadingContainer.style.display = 'flex';
    }
  }

  hideLoading() {
    const loadingContainer = document.getElementById('story-detail-loading-container');
    if (loadingContainer) {
      loadingContainer.style.display = 'none';
    }
  }

  showMapLoading() {
    const mapContainer = document.getElementById('story-detail-map');
    if (mapContainer) {
      mapContainer.innerHTML = generateLoaderAbsoluteTemplate();
    }
  }

  hideMapLoading() {
  }
}