//Todo: App Global Variables
const formModal = document.getElementById('formModal');
const modalTitle = formModal.querySelector('.modal-title');
const modalFooter = formModal.querySelector('.modal-footer');
// form modal inputs
const searchInput = document.querySelector('#search-input');
const websiteName = formModal.querySelector('#websiteName');
const websiteNameError = formModal.querySelector('#websiteNameError');
const websiteUrl = formModal.querySelector('#basic-url');
const websiteUrlError = formModal.querySelector('#urlError');
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const searchFilterUi = document.querySelector('#search-error-msg');
// dynamic modal title and buttons
const addNewBookmarktitle = `<h1 class="modal-title fs-5 ms-auto" id="formModalLabel" style="
                font-family: 'Poppins';
                font-weight: bold;
                letter-spacing: 1px;
              ">
              <i class="bi bi-plus-circle" style="color: #6366f1"></i>
              add new bookmark
            </h1>`;
const addNewBookmarkBtn = `<button
              class="text-uppercase addbookmark w-100 d-flex justify-content-center align-items-center rounded-3 fw-bolder" id="addBookmark"
              style="height: 50px"
            >
              <i class="bi bi-plus" style="font-size: 2rem" ></i>
              add bookmark
            </button>`;
const editBookmarkTitle = `<h1 class="modal-title fs-5 ms-auto" id="formModalLabel" style="
                font-family: 'Poppins';
                font-weight: bold;
                letter-spacing: 1px;
              ">
              <i class="bi bi-pencil-square" style="color: #6366f1"></i>
              edit bookmark
            </h1>`;
const editBookmarkBtn = `<button
              class="text-uppercase addbookmark w-100 d-flex justify-content-center align-items-center rounded-3 fw-bolder gap-2" id="saveBookmark"
              style="height: 50px"
            >
              <i class="bi bi-bookmark-plus-fill" style="font-size: 1.5rem" ></i>
              save bookmark
            </button>`;
// website url regex
const websiteRegex = /^(www\.)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
const bookmarksError = document.querySelector('#bookmarks-error-msg');
const bookmarkList = JSON.parse(localStorage.getItem('bookmarkList') || '[]');

bookmarkList.length > 0
  ? (table.classList.remove('d-none'),
    bookmarksError.classList.add('d-none'),
    searchFilterUi.classList.add('d-none'),
    renderuserBookmarks())
  : (table.classList.add('d-none'),
    bookmarksError.classList.remove('d-none'),
    searchFilterUi.classList.add('d-none'));

//Todo: App functions
const setModalContent = (title, content) => (title.innerHTML = content);

function resetModalForm() {
  // Clear inputs
  websiteName.value = '';
  websiteUrl.value = '';

  // Reset validation states
  websiteName.classList.remove('is-valid', 'is-invalid');
  websiteUrl.classList.remove('is-valid', 'is-invalid');
  websiteNameError.classList.add('d-none');
  websiteUrlError.classList.add('d-none');
}

function captureUserInput() {
  return {
    websiteName: websiteName.value,
    websiteUrl: websiteUrl.value,
  };
}

function addBookMark(addbookmarkBtn) {
  searchFilterUi.classList.add('d-none');
  const modal = bootstrap.Modal.getInstance(formModal);
  addbookmarkBtn.addEventListener('click', () => {
    if (
      websiteName.classList.contains('is-valid') &&
      websiteUrl.classList.contains('is-valid')
    ) {
      // here capture user data
      bookmarkList.push(captureUserInput());
      updateStorage(bookmarkList);
      renderuserBookmarks();
      resetModalForm();
      bookmarksError.classList.add('d-none');
      modal.hide();
    }
  });
}

function deleteBookmark(id) {
  bookmarkList.splice(id, 1);
  updateStorage(bookmarkList);
  renderuserBookmarks();
  bookmarkList.length === 0 &&
    (table.classList.add('d-none'), bookmarksError.classList.remove('d-none'));
  searchInput.value = '';
}

function renderuserBookmarks() {
  bookmarkList
    ? table.classList.remove('d-none')
    : table.classList.add('d-none');

  let textContainer = ``;
  for (var i = 0; i < bookmarkList.length; i++) {
    textContainer += `<tr class="border-bottom">
              <td class="p-2 text-center">${i + 1}</td>
              <td class="p-2">${
                bookmarkList[i]?.websiteName?.toUpperCase() || ''
              }</td>
              <td class="p-2">
                <a class="btn btn-warning text-uppercase text-light"
                href="https://${bookmarkList[i].websiteUrl}"
                target="_blank">
                  <i class="bi bi-box-arrow-up-right"></i>
                  visit
                </a>
              </td>
              <td class="p-2">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#formModal"
                  data-bs-whatever="editBookmarkMood"
                  onclick="editBookmark(${i})"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteBookmark(${i})">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>`;
  }

  tbody.innerHTML = textContainer;
}

function updateStorage(storageArray) {
  localStorage.setItem('bookmarkList', JSON.stringify(storageArray));
}

function editBookmark(id) {
  websiteName.value = bookmarkList[id].websiteName;
  websiteUrl.value = bookmarkList[id].websiteUrl;
  let saveBookmarkBtn = document.querySelector('#saveBookmark');
  const modal = bootstrap.Modal.getInstance(formModal);
  //*   EventListener on saveBookmark button
  saveBookmarkBtn.addEventListener('click', () => {
    if (websiteName.value !== '' && websiteUrl.value !== '') {
      bookmarkList[id].websiteName = websiteName.value;
      bookmarkList[id].websiteUrl = websiteUrl.value;
      updateStorage(bookmarkList);
      renderuserBookmarks();
      modal.hide();
    }
  });
}

//Todo: App EventListeners

formModal.addEventListener('show.bs.modal', e => {
  //* get the triggered modal button
  const button = e.relatedTarget;
  const mood = button.getAttribute('data-bs-whatever');
  //* check app mood add or edit bookmark
  switch (mood) {
    case 'addBookmarkMood':
      setModalContent(modalTitle, addNewBookmarktitle);
      setModalContent(modalFooter, addNewBookmarkBtn);
      let addbookmarkBtn = formModal.querySelector('#addBookmark');
      addBookMark(addbookmarkBtn);
      break;
    case 'editBookmarkMood':
      setModalContent(modalTitle, editBookmarkTitle);
      setModalContent(modalFooter, editBookmarkBtn);
      break;
  }
});

formModal.addEventListener('hidden.bs.modal', () => {
  resetModalForm();
});

websiteName.addEventListener('keyup', function () {
  if (websiteName.value.length < 3 || websiteName.value === '') {
    websiteName.classList.remove('is-valid');
    websiteName.classList.add('is-invalid');
    websiteNameError.classList.remove('d-none');
  } else {
    websiteName.classList.remove('is-invalid');
    websiteName.classList.add('is-valid');
    websiteNameError.classList.add('d-none');
  }
});

websiteUrl.addEventListener('keyup', function () {
  if (!websiteRegex.test(websiteUrl.value)) {
    websiteUrl.classList.remove('is-valid');
    websiteUrl.classList.add('is-invalid');
    websiteUrlError.classList.remove('d-none');
  } else {
    websiteUrl.classList.remove('is-invalid');
    websiteUrl.classList.add('is-valid');
    websiteUrlError.classList.add('d-none');
  }
});

searchInput.addEventListener('input', function (e) {
  let searchQuery = e.target.value.trim().toLowerCase();

  // Hide both messages initially
  bookmarksError.classList.add('d-none');
  searchFilterUi.classList.add('d-none');

  if (bookmarkList.length === 0) {
    // If no bookmarks exist at all, show the "No bookmarks yet" message
    bookmarksError.classList.remove('d-none');
    table.classList.add('d-none');
    return;
  }

  let filteredSearch = bookmarkList.filter(item =>
    item.websiteName.toLowerCase().includes(searchQuery)
  );

  if (filteredSearch.length > 0) {
    // Show filtered results
    let textContainer = ``;
    for (var i = 0; i < filteredSearch.length; i++) {
      const index = bookmarkList.findIndex(
        item => item.websiteName === filteredSearch[i].websiteName
      );

      textContainer += `<tr class="border-bottom">
                <td class="p-2 text-center">${i + 1}</td>
                <td class="p-2">${filteredSearch[
                  i
                ].websiteName.toUpperCase()}</td>
                <td class="p-2">
                  <a class="btn btn-warning text-uppercase text-light"
                  href="https://${filteredSearch[i].websiteUrl}"
                  target="_blank">
                    <i class="bi bi-box-arrow-up-right"></i>
                    visit
                  </a>
                </td>
                <td class="p-2">
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#formModal"
                    data-bs-whatever="editBookmarkMood"
                    onclick="editBookmark(${index})"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-danger" onclick="deleteBookmark(${index})">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>`;
    }
    tbody.innerHTML = textContainer;
    table.classList.remove('d-none');
  } else {
    table.classList.add('d-none');
    searchFilterUi.classList.remove('d-none');
  }
});
