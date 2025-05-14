import NewStoryPresenter from "./new-story-presenter";
import StoryApi from "../../data/api";
import Map from "../../utils/map";
import Camera from "../../utils/camera";
import { generateLoaderAbsoluteTemplate } from "../../templates";

export default class NewStoryPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #photoBlob = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="new-story__header">
          <div class="container">
            <h1 class="new-story__header__title">Create New Story</h1>
            <p class="new-story__header__description">
              Share your moment with others. Take a photo, tell your story, and mark your location.
            </p>
          </div>
        </div>
      </section>
  
      <section class="container">
        <div class="new-form__container">
          <form id="new-story-form" class="new-form">
            <div class="form-control">
              <label for="description-input" class="new-form__description__title">Your Story</label>

              <div class="new-form__description__container">
                <textarea
                  id="description-input"
                  name="description"
                  placeholder="Share what happened, where you are, how you feel..."
                  required
                  aria-describedby="description-input-info"
                ></textarea>
              </div>
              <div id="description-input-info" class="form-help">Tell your story in as much detail as you'd like</div>
            </div>
            
            <div class="form-control">
              <label for="photo-input" class="new-form__photo__title">Photo</label>
              <div id="photo-input-info" class="form-help">Take a photo with your camera or upload an image</div>

              <div class="new-form__photo__container">
                <div class="new-form__photo__buttons">
                  <button id="upload-photo-button" class="btn btn-outline" type="button">
                    <i class="fas fa-upload" aria-hidden="true"></i> Upload Image
                  </button>
                  <input
                    id="photo-input"
                    class="new-form__photo__input"
                    name="photo"
                    type="file"
                    accept="image/*"
                    aria-describedby="photo-input-info"
                  >
                  <button id="open-camera-button" class="btn btn-outline" type="button">
                    <i class="fas fa-camera" aria-hidden="true"></i> Open Camera
                  </button>
                </div>
                
                <div id="camera-container" class="new-form__camera__container">
                  <video id="camera-video" class="new-form__camera__video">
                    Video stream not available.
                  </video>
                  <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>

                  <div class="new-form__camera__tools">
                    <select id="camera-select" aria-label="Select camera"></select>
                    <div class="new-form__camera__tools_buttons">
                      <button id="camera-take-button" class="btn" type="button">
                        <i class="fas fa-camera" aria-hidden="true"></i> Take Photo
                      </button>
                    </div>
                  </div>
                </div>
                
                <div id="photo-preview-container" class="new-form__photo__preview-container"></div>
              </div>
            </div>
            
            <div class="form-control">
              <div class="new-form__location__title">Location</div>
              <div id="location-input-info" class="form-help">Click on the map to set your location</div>

              <div class="new-form__location__container">
                <div class="new-form__location__map__container">
                  <div id="map" class="new-form__location__map"></div>
                  <div id="map-loading-container"></div>
                </div>
                <div class="new-form__location__lat-lng">
                  <input type="number" id="latitude-input" name="latitude" step="any" placeholder="Latitude" readonly>
                  <input type="number" id="longitude-input" name="longitude" step="any" placeholder="Longitude" readonly>
                </div>
              </div>
            </div>
            
            <div id="submit-error" class="form-error"></div>
            
            <div class="form-buttons">
              <span id="submit-button-container">
                <button class="btn btn-primary" type="submit">Post Story</button>
              </span>
              <a class="btn btn-outline" href="#/">Cancel</a>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NewStoryPresenter({
      view: this,
      model: StoryApi,
    });

    
    this.#setupForm();

    
    await this.#presenter.showNewStoryMap();
  }

  #setupForm() {
    this.#form = document.getElementById("new-story-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem("description").value,
        photo: this.#photoBlob,
        lat:
          parseFloat(this.#form.elements.namedItem("latitude").value) || null,
        lon:
          parseFloat(this.#form.elements.namedItem("longitude").value) || null,
      };

      await this.#presenter.postNewStory(data);
    });

    document
      .getElementById("photo-input")
      .addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        this.#photoBlob = file;
        this.#displayPhotoPreview(file);
      });

    document
      .getElementById("upload-photo-button")
      .addEventListener("click", () => {
        this.#form.elements.namedItem("photo").click();
      });

    const cameraContainer = document.getElementById("camera-container");
    document
      .getElementById("open-camera-button")
      .addEventListener("click", async (event) => {
        cameraContainer.classList.toggle("open");
        this.#isCameraOpen = cameraContainer.classList.contains("open");

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Close Camera";
          event.currentTarget.setAttribute("aria-label", "Close camera");
          this.#setupCamera();
          this.#camera.launch();
          return;
        }

        event.currentTarget.innerHTML =
          '<i class="fas fa-camera" aria-hidden="true"></i> Open Camera';
        event.currentTarget.setAttribute("aria-label", "Open camera");
        this.#camera.stop();
      });
  }

  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }

    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const blob = await this.#camera.takePicture();
      this.#photoBlob = blob;
      this.#displayPhotoPreview(blob);
    });
  }

  #displayPhotoPreview(blob) {
    const previewContainer = document.getElementById("photo-preview-container");
    const imageUrl = URL.createObjectURL(blob);

    previewContainer.innerHTML = `
      <div class="photo-preview">
        <img src="${imageUrl}" alt="Story photo preview" class="photo-preview__image">
        <button type="button" id="remove-photo-button" class="photo-preview__remove btn btn-danger">
          <i class="fas fa-trash" aria-hidden="true"></i>
        </button>
      </div>
    `;

    document
      .getElementById("remove-photo-button")
      .addEventListener("click", () => {
        this.#photoBlob = null;
        previewContainer.innerHTML = "";
      });
  }

  async initialMap() {
    this.#form = this.#form || document.getElementById("new-story-form");

    if (!this.#form) {
      console.error("Form not found during map initialization");
      return; 
    }

    this.#map = await Map.build("#map", {
      zoom: 15,
      locate: true,
    });

    const centerCoordinate = this.#map.getCenter();
    this.#updateLatLngInput(
      centerCoordinate.latitude,
      centerCoordinate.longitude
    );

    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: true }
    );

    draggableMarker.on("dragend", (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener("click", (event) => {
      draggableMarker.setLatLng(event.latlng);

      this.#updateLatLngInput(event.latlng.lat, event.latlng.lng);

      if (event.sourceTarget) {
        event.sourceTarget.flyTo(event.latlng);
      } else if (event.target) {
        event.target.flyTo(event.latlng);
      }
    });
  }

  #updateLatLngInput(latitude, longitude) {
    if (!this.#form) {
      console.error("Cannot update coordinates: form not initialized");
      return;
    }

    const latInput = this.#form.elements.namedItem("latitude");
    const lngInput = this.#form.elements.namedItem("longitude");

    if (latInput) latInput.value = latitude;
    if (lngInput) lngInput.value = longitude;
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showSubmitLoading() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn btn-primary" type="submit" disabled>
        <i class="fas fa-spinner loader-button" aria-hidden="true"></i> Posting Story...
      </button>
    `;
  }

  hideSubmitLoading() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn btn-primary" type="submit">Post Story</button>
    `;
  }

  showSubmitError(message) {
    const errorElement = document.getElementById("submit-error");
    errorElement.textContent =
      message || "An error occurred. Please try again.";
    errorElement.classList.add("visible");

    errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  storeSuccessfully(message) {
    alert(message || "Your story has been posted successfully!");
    this.clearForm();

    location.hash = "/";
  }

  clearForm() {
    this.#form.reset();
    document.getElementById("photo-preview-container").innerHTML = "";
    this.#photoBlob = null;

    if (this.#isCameraOpen) {
      document.getElementById("camera-container").classList.remove("open");
      this.#isCameraOpen = false;
      this.#camera.stop();

      const cameraButton = document.getElementById("open-camera-button");
      cameraButton.innerHTML =
        '<i class="fas fa-camera" aria-hidden="true"></i> Open Camera';
      cameraButton.setAttribute("aria-label", "Open camera");
    }
  }
}
