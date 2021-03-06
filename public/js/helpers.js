// Regarder Controller.js en premier !
// Ci-dessous, toutes les fonctions helpers

// J'importe ce dont j'ai besoin
import { CONSTANTS } from "./config.js";

// je crée une fonction timeout, qui retourne une promesse, rejetée au bout de XX secondes (dans mon cas 10, cf config.js)
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// ma fonction de récupération des données depuis l'API, qui est une course entre la fonction timeout, et la résolution du fetch d'une URL. Si le fetch des données "gagne", le résultat de la promesse est parser à son tour, sinon,
export const get_json = async function (url) {
  try {
    const res = await Promise.race([
      fetch(url),
      timeout(CONSTANTS.TIMEOUT_SEC),
    ]);
    const data = await res.json();

    // Petite condition au cas-où la réponse ne soit pas comprise
    if (!res.ok) {
      init("Woops. Something went wrong! Did you try something naughty?");
      throw new Error(`${data.message} (${res.status})`);
    }
    return data;
  } catch (err) {
    throw new Error("And ... we got some issues captain" + err);
  }
};

// Une petite fonction pour raccourcir une chaîne de caractère
export function shorten_string(string, maxLength) {
  if (string.length > maxLength) {
    return `${string.substring(0, maxLength - 3)}...`;
  } else {
    return string;
  }
}

// Fonction pour construire une partie de l'URL de la requête de recherche selon le filtre choisi. Pour le filtre "Everything", j'ai choisi de chercher tous les termes en vrac
export function construct_url_part(searchType, query) {
  if (searchType === "artist-opt") {
    return `artist:"${query}" OR artistname:"${query}"`;
  } else if (searchType === "track-opt") {
    return `recording:"${query}"`;
  } else if (searchType === "release-opt") {
    return `release:"${query}"`;
  } else {
    return `${query}`;

    /* Bon ça, c'était au début, je voulais faire un Rick-roll :D si tu mets rien dans la recherche, mais je me suis dit que ça pourrait être vu comme une solution de facilité, du coup je l'ai simplement géré dans le controller
    if (!query) {
      return 'recording:"Never gonna give you up" AND artist:"Rick Astley"';
    } else {
      return `"${query}"`;
    }

*/
  }
}

// Fonction de conversion des millisecondes en minutes / secondes (pour la durée de la piste)
export function convert_millis_to_mins_seconds(tracklength) {
  let minutes = Math.floor(tracklength / 60000);
  let seconds = ((tracklength % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Fonction d'initiation de l'appli (quand on charge l'appli ou que l'on fait une nouvelle recherche)
export function init(message) {
  CONSTANTS.SEARCH_FIELD.focus();
  CONSTANTS.MODAL_WINDOW.classList.add("hidden");
  CONSTANTS.PARENT_ELEMENT.innerHTML = "";
  CONSTANTS.SEARCH_FIELD.value = "";
  CONSTANTS.NEW_SEARCH.classList.add("hidden");
  CONSTANTS.RESULT_COUNT_MESSAGE.classList.add("hidden");
  CONSTANTS.RESULT_MESSAGE.innerHTML = `
  <p class="font-bold italic text-center text-blue-800">${message}</p>
`;
  CONSTANTS.HEADER.classList.remove("pt-16");
}

// Fonction qui supprime les doublons d'un tableau. Je l'ai choppé sur le net !
export function remove_duplicates(array) {
  var prims = { boolean: {}, number: {}, string: {} },
    objs = [];

  return array.filter(function (item) {
    var type = typeof item;
    if (type in prims)
      return prims[type].hasOwnProperty(item)
        ? false
        : (prims[type][item] = true);
    else return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
}

// Fonction qui récupère la position au scroll (X et Y)
//below taken from http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
export function GETSCROLLXY() {
  var scrOfX = 0,
    scrOfY = 0;
  if (typeof window.pageYOffset == "number") {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if (
    document.body &&
    (document.body.scrollLeft || document.body.scrollTop)
  ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if (
    document.documentElement &&
    (document.documentElement.scrollLeft || document.documentElement.scrollTop)
  ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [scrOfX, scrOfY];
}

// Fonction qui récupère la taille de mon document
//taken from http://james.padolsey.com/javascript/get-document-height-cross-browser/
export function GETDOCHEIGHT() {
  var D = document;
  return Math.max(
    D.body.scrollHeight,
    D.documentElement.scrollHeight,
    D.body.offsetHeight,
    D.documentElement.offsetHeight,
    D.body.clientHeight,
    D.documentElement.clientHeight
  );
}

// Comme j'utilise beaucoup de innerHTML et de insertAdjacentHTML (parce que c'est quand même vachement plus simple avec Tailwind ...), je m'assure de traiter les chaînes de caractères qui sont envoyées dans les requêtes par l'utilisateur, mais aussi de traiter les chaînes de caractères qui reviennent de MusicBrainz. C'est pas très propre et sans doute pas ultra performant, mais quand tu (Antho) m'a dit qu'il fallait aussi penser au fait qu'un super-hacker pourrait prendre la main sur ce qui était envoyé via l'API, c'était trop tard pour refaire tout mon code (ou en tout cas, ça m'aurait pris énormément de temps de refaire le tout et passer à des ajouts d'element / de classnames), j'ai donc choisi cette solution là ...
export function escape_html(string) {
  let map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return string.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}
