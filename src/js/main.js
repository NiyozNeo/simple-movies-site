/* Select function */
let findEl = element => document.querySelector(element);
let createEl = element => document.createElement(element);

/* Main selections */
let form = findEl(".js-form");
let select = findEl(".js-selsect");
let ul = findEl(".films__list");
let searchEl = findEl(".form-search");
let sortSelect = findEl(".form-sort");
let templateFilms = findEl("#template").content
let modal = findEl(".modal");
let modalCloseBtn = findEl(".modal__btn")
/* Main variables */
let filmGenres = [];

let bookmarksArr = JSON.parse(window.localStorage.getItem("bookmarks")) || []
let body = findEl("body");
let bookmarksList = findEl(".bookmark-list");
let bookmarkBtn = findEl(".bookmark-btn");
let bookmarkModal = findEl(".bookmark-modal");
let bookmarkTemmplate = findEl(".bookmark-template").content
let bookmarksFragment = document.createDocumentFragment()


/* Find date */
function date(date) {

    let minut = new Date(date).getMinutes();
    let secund = new Date(date).getSeconds();
    let hour = new Date(date).getHours();

    return `${String(hour).padStart(2, "0")}:${String(minut).padStart(2, "0")}:${String(secund).padStart(2, "0")}`
}

let sortAz = function (a, b) {
    if (a.title > b.title) {
        return 1
    } else if (a.title < b.title) {
        return -1
    } else {
        return 0
    }
}

let sortZa = function (a, b) {
    if (a.title > b.title) {
        return -1
    } else if (a.title < b.title) {
        return 1
    } else {
        return 0
    }
}

let newOld = function (a, b) {
    a.release_date - b.release_date;
}

let oldNew = function (a, b) {
    b.release_date - a.release_date;
}

let sortObj = {
    0: sortAz,
    1: sortZa,
    2: newOld,
    3: oldNew
}

/* Create film */
function createFilm(film) {
    let template = templateFilms.cloneNode(true);
    template.querySelector(".list-poster").src = film.poster;
    template.querySelector(".list-poster").width = 300;
    template.querySelector(".list-poster").height = 400;
    template.querySelector(".list-poster").style = "border-radius: 5px;";
    template.querySelector(".list-name").textContent = film.title;
    template.querySelector(".list-data").textContent = date(film.release_date);
    template.querySelector(".list-button").dataset.id = film.id
    /* Round genres */
    film.genres.forEach(genre => {
        let li = createEl("li");
        li.textContent = genre;
        template.querySelector(".genres-list").appendChild(li);

        /* run in genres round */
        findByGenre(genre)
    })
    template.querySelector(".list-save").dataset.id = film.id
    ul.appendChild(template)
}



/* Find by Genres */
function findByGenre(genre) {
    if (!filmGenres.includes(genre)) {
        filmGenres.push(genre)

        /* Find Genre and add to option */
        let option = createEl("option");
        option.textContent = genre;
        select.appendChild(option)
    }
}



function searchFunc(evt) {
    evt.preventDefault();

    ul.innerHTML = ""

    let value = select.value;
    let searchValue = searchEl.value;
    let sortValue = sortSelect.value
    let newRegExp = new RegExp(searchValue, "gi")

    let foundFilms = films.filter(film => {
        if (value === "All") {
            return films
        } else {
            return film.genres.includes(value)
        }
    }).filter(film => {
        return film.title.match(newRegExp)
    }).sort(sortObj[sortValue])

    foundFilms.forEach(film => {
        createFilm(film)
    })
}

films.forEach(element => {
    createFilm(element)
})

form.addEventListener("submit", searchFunc);


bookmarksArr.forEach(movie => renderBookmarks(movie))


ul.addEventListener("click", function (evt) {
    if (evt.target.matches(".list-button")) {
        modal.classList.add("modal-open");
        
        let foundMovie = films.find(movie =>movie.id === evt.target.dataset.id)
       
        document.querySelector(".modal__title").textContent = foundMovie.title
        document.querySelector(".modal__text").textContent = foundMovie.overview


        //modal close functions //
        document.addEventListener("keyup", function (evt) {
            if (evt.keyCode === 27) {
                modal.classList.remove("modal-open")
            }
        })


        modal.addEventListener("click", function (evt) {
            if (evt.target === modal) {
                modal.classList.remove("modal-open")
            }
        })

        modalCloseBtn.addEventListener("click", function () {
            modal.classList.remove("modal-open")
        })

        
    }


    if (evt.target.matches(".list-save")) {
        let foundMovie = films.find((movie) => movie.id === evt.target.dataset.id)
        console.log("heloo");
        if (!bookmarksArr.includes(foundMovie)) {
            bookmarksArr.push(foundMovie)
            
            window.localStorage.setItem("bookmarks", JSON.stringify(bookmarksArr))
        }

        bookmarksList.innerHTML = null

        bookmarksArr.forEach(movie => renderBookmarks(movie))


        bookmarksList.appendChild(bookmarksFragment)
    }
})

bookmarkBtn.addEventListener("click", function () {
    bookmarkModal.classList.add("modal-open")
    
    body.style = "overflow-y: hidden;"
    

    bookmarkModal.addEventListener("click", function (evt) {
        if (evt.target === bookmarkModal) {
            bookmarkModal.classList.remove("modal-open")
            body.style = "overflow-y: scroll;"

        }
    })
})

function renderBookmarks(bookmarkMovie) {
    let elBookmark = bookmarkTemmplate.cloneNode(true)

    elBookmark.querySelector(".movie-name").textContent = bookmarkMovie.title
    elBookmark.querySelector(".movie-remove-btn").dataset.id = bookmarkMovie.id

    bookmarksFragment.appendChild(elBookmark)
}

bookmarksList.addEventListener("click", function (evt) {
    if (evt.target.matches(".movie-remove-btn")) {
        let foundIndex = bookmarksArr.findIndex(item => item.id === evt.target.dataset.id)
        bookmarksArr.splice(foundIndex, 1)
        
        bookmarksArr.forEach(movie => renderBookmarks(movie))
        bookmarksList.innerHTML = null

        bookmarksList.appendChild(bookmarksFragment)

        window.localStorage.setItem("bookmarks", JSON.stringify(bookmarksArr))
    }
})