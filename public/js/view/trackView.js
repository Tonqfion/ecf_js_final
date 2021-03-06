// La trackview, où le markup est généré à partir du state.details.trackDetails

import view from "./view.js";

class TrackView extends view {
  generateMarkup() {
    return `<h2 class="inline text-3xl leading-6 font-medium text-gray-900" id="modal-title">
    ${this.data.trackTitle}
  </h2><i id="control-bookmark-icon" class="${
    this.data.trackBookmarked ? "fas" : "far"
  } fa-bookmark ml-4 py-2 px-3 text-red-700 text-xl border-2 border-red-700 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"></i>
  <button type="button" id="control-bookmark-text"
  class="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-1 sm:w-auto sm:text-sm">
  ${this.data.trackBookmarked ? `Delete from Bookmark` : `Add to Bookmark`}
</button>
  <div class="mt-2">
  <h3 class="mt-2 text-xl text-gray-900">First release date</h3>
  <p class="border-b-2 pb-2">
  ${this.data.trackReleaseDate}
  </p>
  <h3 class="mt-2 text-xl text-gray-900">Track duration</h3>
  <p class="border-b-2 pb-2">
  ${this.data.trackLength}
  </p>
    <h3 class="mt-2 text-xl text-gray-900">Artist credits</h3>
    <p class="border-b-2 pb-2">
    ${this.data.trackArtists}
    </p>
    <h3 class="mt-2 text-xl text-gray-900">Release list</h3>
    <p class="border-b-2 pb-2">
    ${this.data.trackReleasesDisplay}
    </p>
    <h3 class="mt-2 text-xl text-gray-900">Genres</h3>
    <p class="border-b-2 pb-2">
    ${this.data.trackGenres}
    </p>
    <h3 class="mt-2 text-xl text-gray-900">Rating</h3>
    <p class="border-b-2 pb-2">
    ${
      isNaN(this.data.trackRating)
        ? this.data.trackRating
        : this.generateStars(this.data.trackRating).join("")
    }
    </p>
    </div>`;
  }

  // La méthode de génération des étoiles (Je savais pas trop où trouver un truc avec des "demi étoiles", du coup je multiplie le score par deux et je note sur 10 étoiles ... #fainéant)
  generateStars(rating) {
    const nbrRating = Math.round(Number(rating) * 2);
    const markUp = [];
    for (let i = 1; i <= nbrRating; i++) {
      markUp.push(`<i class="fas fa-star"></i>`);
    }
    for (let i = nbrRating; i < 10; i++) {
      markUp.push(`<i class="far fa-star"></i>`);
    }
    return markUp;
  }

  // Le handler pour l'ajout des bookmarks, les boutons n'étant pas crées au moment de la génération de la page, je devais trouver un moyen différent d'ajouter les eventListeners
  addHandlerAddBookmark(handler) {
    this.parentElement.addEventListener("click", function (e) {
      const btnText = e.target.closest("#control-bookmark-text");
      if (!btnText) return;
      handler();
    });
    this.parentElement.addEventListener("click", function (e) {
      const btnIcon = e.target.closest("#control-bookmark-icon");
      if (!btnIcon) return;
      handler();
    });
  }

  // L'update de l'affichage de la modale lorsqu'on clic sur un bouton d'ajout / suppression des bookmarks, pour changer le texte et l'icône fontAwesome. Ca permet de comparer l'état du dom précédent, au nouveau, et de changer uniquement les parties qui ont été modifiés (mieux que de tout régénérer) au niveau du text ainsi que des attributs.
  updateTrackView(data) {
    this.data = data;
    const newMarkup = this.generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this.parentElement.querySelectorAll("*"));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue !== "") {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
}

// J'exporte une instance par défaut pour le controller
export default new TrackView();
