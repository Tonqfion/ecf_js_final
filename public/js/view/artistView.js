import View from "./view.js";

class ArtistView extends View {
  generateMarkup() {
    return `<h2 class="text-3xl leading-6 font-medium text-gray-900" id="modal-title">
    ${this.data.artistName}
  </h2>
  <div class="mt-2">
  <h3 class="mt-2 text-xl text-gray-900">Begin Date / End Date</h3>
  <p class="border-b-2 pb-2">
  ${this.data.artistStartDate} / ${this.data.artistEndDate}
  </p>
  <h3 class="mt-2 text-xl text-gray-900">Area</h3>
  <p class="border-b-2 pb-2">
  ${this.data.artistArea}
  </p>
    </div>`;
  }
}

export default new ArtistView();

/*
    <h3 class="mt-2 text-xl text-gray-900">Artist releases</h3>
    <p class="border-b-2 pb-2">
      ${this.data.artistReleases
        .map((release) => release.title + " - " + release.date)
        .join(" <br> ")}
    </p>
*/