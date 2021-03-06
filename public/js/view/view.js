import { CONSTANTS } from "../config.js";

// Ma view de base, qui inclue la méthode render (la même pour toutes les views), le clear, et le spinner !
export default class View {
  modal = CONSTANTS.MODAL_WINDOW;
  parentElement = document.getElementById("details-content");
  data;

  render(data) {
    this.data = data;
    const markup = this.generateMarkup();
    this.clear();
    this.parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  clear() {
    this.parentElement.innerHTML = "";
  }
  renderSpinner() {
    this.modal.classList.remove("hidden");
    const markup = `
    <div class="mx-auto flex-col justify-center	items-center">
    <svg
    class="animate-spin ml-1 mr-3 h-5 w-5 text-blue-800"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
  </div>
          `;
    this.clear();
    this.parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
