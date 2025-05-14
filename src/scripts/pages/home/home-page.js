import HomePresenter from './home-presenter';
import StoryApi from '../../data/api';
import Map from '../../utils/map';
import { generateLoaderAbsoluteTemplate, generateStoryItemTemplate, generateStoriesListEmptyTemplate, generateStoriesListErrorTemplate } from '../../templates';

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="container">
        <h1 class="visually-hidden">Story App - Share your moments</h1>
        
        <!-- Skip link for accessibility -->
        <a href="#main-content" class="skip-link">Skip to content</a>
        
        <div class="hero">
          <h2>Share Your Stories with the World</h2>
          <p>Capture moments, share experiences, and connect with others through your stories.</p>
        </div>
      </section>

      <section class="map-section">
        <div class="container">
          <h2 class="section-title">Stories Around the World</h2>
          <div class="stories-list__map__container">
            <div id="map" class="stories-list__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>
      </section>
      
      <section id="main-content" class="container story-list-section" tabindex="-1">
        <h2 class="section-title">Latest Stories</h2>
        
        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryApi,
    });

    await this.#presenter.initialStoriesAndMap();
  }

  populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      if (this.#map && story.lat && story.lon) {
        const coordinate = [story.lat, story.lon];
        const markerOptions = { alt: `${story.name}'s story location` };
        const popupOptions = { 
          content: `
            <div class="map-popup">
              <img src="${story.photoUrl}" alt="${story.name}'s story" class="map-popup__image">
              <div class="map-popup__content">
                <h3>${story.name}'s Story</h3>
                <a href="#/stories/${story.id}" class="btn btn-sm">View Story</a>
              </div>
            </div>
          `
        };

        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

      return accumulator.concat(generateStoryItemTemplate(story));
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 3,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}