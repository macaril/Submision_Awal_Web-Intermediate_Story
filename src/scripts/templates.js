import { showFormattedDate } from './utils';

export function generateLoaderTemplate() {
  return `
    <div class="loader" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li><a id="new-story-button" class="btn btn-primary new-story-button" href="#/new" aria-label="Create a new story">Create Story <i class="fas fa-plus" aria-hidden="true"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout" aria-label="Logout from your account"><i class="fas fa-sign-out-alt" aria-hidden="true"></i> Logout</a></li>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h2>No stories available</h2>
      <p>There are currently no stories to display.</p>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <h2>Error retrieving stories</h2>
      <p>${message || 'Please try using a different network or report this error.'}</p>
    </div>
  `;
}

export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="story-detail-error" class="story-detail__error">
      <h2>Error retrieving story details</h2>
      <p>${message || 'Please try using a different network or report this error.'}</p>
    </div>
  `;
}

export function generateStoryItemTemplate(story) {
  const { id, photoUrl, description, createdAt, name, lat, lon } = story;
  
  // Truncate description to keep card compact
  const truncatedDescription = description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;
  
  const locationText = lat && lon ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : 'No location data';
  
  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
      <div class="story-item__image-container">
        <img class="story-item__image" src="${photoUrl}" alt="Story image by ${name}" loading="lazy">
      </div>
      <div class="story-item__body">
        <div class="story-item__main">
          <h2 class="story-item__title">${name}'s Story</h2>
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt" aria-hidden="true"></i> ${showFormattedDate(createdAt, 'en-US')}
            </div>
            <div class="story-item__location">
              <i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${locationText}
            </div>
          </div>
        </div>
        <div class="story-item__description">
          ${truncatedDescription}
        </div>
        <a class="btn btn-secondary story-item__read-more" href="#/stories/${id}" aria-label="Read more about ${name}'s story">
          Read More <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  `;
}

export function generateStoryDetailTemplate(story) {
  const { photoUrl, description, createdAt, name, lat, lon } = story;
  
  return `
    <div class="story-detail">
      <div class="story-detail__header">
        <h2 class="story-detail__title">${name}'s Story</h2>
        <p class="story-detail__date">
          <i class="fas fa-calendar-alt" aria-hidden="true"></i> ${showFormattedDate(createdAt, 'en-US')}
        </p>
      </div>
      
      <div class="story-detail__image-container">
        <img class="story-detail__image" src="${photoUrl}" alt="Full story image by ${name}">
      </div>
      
      <div class="story-detail__content">
        <p class="story-detail__description">${description}</p>
      </div>
      
      ${lat && lon ? `
        <div class="story-detail__map-container">
          <div id="story-detail-map" class="story-detail__map"></div>
        </div>
      ` : ''}
      
      <div class="story-detail__actions">
        <a href="#/" class="btn btn-secondary" aria-label="Back to story list">
          <i class="fas fa-arrow-left" aria-hidden="true"></i> Back to Stories
        </a>
      </div>
    </div>
  `;
}