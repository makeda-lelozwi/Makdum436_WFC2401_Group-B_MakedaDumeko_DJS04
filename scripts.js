import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import { bookPreviewBtn } from "./displayPreviewsConstructor.js";

//ALL THE NECESSARY ELEMENTS FROM THE DOM
const booksListDiv = document.querySelector("[data-list-items]");

const genreDropDownMenu = document.querySelector("[data-search-genres]");
const authorDropDownMenu = document.querySelector("[data-search-authors]");

const showMoreBtn = document.querySelector("[data-list-button]");

const searchBtn = document.querySelector("[data-header-search]");
const searchOverlay = document.querySelector("[data-search-overlay]");
const bookSearchForm = document.querySelector("[data-search-form]");
const titleSearchInput = document.querySelector("[data-search-title]");
const searchCancelBtn = document.querySelector("[data-search-cancel]");
const noResultsMessage = document.querySelector("[data-list-message]");

const settingsBtn = document.querySelector("[data-header-settings]");
const settingsOverlay = document.querySelector("[data-settings-overlay]");
const themeSettingsForm = document.querySelector("[data-settings-form]");
const settingsCancelBtn = document.querySelector("[data-settings-cancel]");

const moreInfoOverlay = document.querySelector("[data-list-active]");
const moreInfoOverlayCloseBtn = document.querySelector("[data-list-close]");

let page = 1;
let booksArray = books;

//DISPLAYING THE FIRST 36 BOOKS TO DOM


const displayBooksPreviews = (array, authors) => {
  const pageLoadFrag = document.createDocumentFragment();
  const bookPreviewBtn = document.createElement("book-previews");
  bookPreviewBtn.classList = "preview";

  for (const { author, image, title } of array.slice(0, BOOKS_PER_PAGE)) {
    bookPreviewBtn.innerHTML = `
    <img class="preview__image" slot="image" src="${image}" alt=""/>
    <div id="title-div" class="preview__title" slot="title">${title}</div>
        <div id="author-div" class="preview__author" slot="author">${authors[author]}</div>
    `;

    pageLoadFrag.appendChild(bookPreviewBtn);
  }

  booksListDiv.appendChild(pageLoadFrag);

  return booksListDiv;
};

displayBooksPreviews(booksArray, authors);

//CREATING THE LIST OF ALL GENRES IN THE SEARCH MODAL

const createSelect = (array, name, dropdown) => {
  const selectFrag = document.createDocumentFragment();

  const firstOption = document.createElement("option");
  firstOption.value = "any";
  firstOption.innerText = `All ${name}s`;
  selectFrag.appendChild(firstOption);

  for (const [id, name] of Object.entries(array)) {
    const option = document.createElement("option");
    option.value = id;
    option.innerText = name;
    selectFrag.appendChild(option);
  }

  dropdown.appendChild(selectFrag);
};

createSelect(genres, "Genre", genreDropDownMenu);

//CREATING THE LIST OF ALL AUTHORS IN THE SEARCH MODAL
createSelect(authors, "Author", authorDropDownMenu);

//TOGGLING DAY AND NIGHT THEMES
const setTheme = (themeName) => {
  if (themeName === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }
};

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches //checks if the user prefers dark mode on their system
) {
  setTheme("night");
}

//LOGIC FOR ENABLING THE SHOW MORE BUTTON
const updateShowMoreBtn = () => {
  if (booksArray.length - page * BOOKS_PER_PAGE < 1) {
    showMoreBtn.disabled = true;
  }

  showMoreBtn.innerHTML = `
    <span>Show more</span>
    <span class = "list__remaining"> (${
      booksArray.length - page * BOOKS_PER_PAGE > 0
        ? booksArray.length - page * BOOKS_PER_PAGE
        : 0
    })</span>
`;
};

updateShowMoreBtn();

//EVENT LISTENERS
//"Cancel" to close the search modal
searchCancelBtn.addEventListener("click", () => {
  searchOverlay.open = false;
});

//"Cancel" to close the settings modal (where user can choose between light and dark theme)
settingsCancelBtn.addEventListener("click", () => {
  settingsOverlay.open = false;
});

//Opens the search modal and focuses on the input where users can type-in a search for a title
searchBtn.addEventListener("click", () => {
  searchOverlay.open = true;
  titleSearchInput.focus();
});

//Opens the settings modal
settingsBtn.addEventListener("click", () => {
  settingsOverlay.open = true;
});

//Closes the modal that has more info about a selected book
moreInfoOverlayCloseBtn.addEventListener("click", () => {
  moreInfoOverlay.open = false;
});

//Changing the theme when the user manually sets it from settings (instead of from system preferences)
themeSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  setTheme(theme);
  //closes the settings modal after changing the theme and pressing save (not saved to localStorage)
  settingsOverlay.open = false;
});

bookSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData); //converts form data into an object
  const filteredBooksArray = []; //empty array to store filtered books

  for (const book of books) {
    let genreMatch = filters.genre === "any";

    for (const singleGenre of book.genres) {
      if (genreMatch) break;
      if (singleGenre === filters.genre) {
        genreMatch = true;
      }
    }

    if (
      (filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === "any" || book.author === filters.author) &&
      genreMatch
    ) {
      filteredBooksArray.push(book);
    }
  }

  page = 1;
  booksArray = filteredBooksArray;

  if (filteredBooksArray.length < 1) {
    noResultsMessage.classList.add("list__message_show");
  } else {
    noResultsMessage.classList.remove("list__message_show");
  }

  booksListDiv.innerHTML = "";

  //DISPLAYING THE FILTERED BOOKS TO THE DOM
  //displayBooksPreviews(filteredBooksArray, authors);

  //same logic for the "show more" button
  updateShowMoreBtn();

  window.scrollTo({ top: 0, behavior: "smooth" });
  searchOverlay.open = false;
});

//EXTENDING THE PAGE AND SHOWING MORE BOOKS AFTER CLICKING "SHOW MORE"
showMoreBtn.addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of booksArray.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

    fragment.appendChild(element);
  }

  booksListDiv.appendChild(fragment);
  page += 1;
});

//EVENT LISTENER FOR DISPLAYING BOOK INFO WHEN CLICKING ON ITS PREVIEW
// booksListDiv.addEventListener("click", (event) => {
//   const pathArray = Array.from(event.path || event.composedPath()); //retrieves clicked element's path
//   let active = null;

//   for (const node of pathArray) {
//     if (active) break;

//     if (node?.dataset?.preview) {
//       let result = null;

//       for (const singleBook of books) {
//         if (result) break;
//         if (singleBook.id === node?.dataset?.preview) result = singleBook;
//       }

//       active = result;
//     }
//   }

//   if (active) {
//     moreInfoOverlay.open = true;
//     document.querySelector("[data-list-blur]").src = active.image;
//     document.querySelector("[data-list-image]").src = active.image;
//     document.querySelector("[data-list-title]").innerText = active.title;
//     document.querySelector("[data-list-subtitle]").innerText = `${
//       authors[active.author]
//     } (${new Date(active.published).getFullYear()})`;
//     document.querySelector("[data-list-description]").innerText =
//       active.description;
//   }
// });
