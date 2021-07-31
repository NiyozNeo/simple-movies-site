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

/* Main variables */
let filmGenres = [];

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

    /* Round genres */
    film.genres.forEach(genre => {
        let li = createEl("li");
        li.textContent = genre;
        template.querySelector(".genres-list").appendChild(li);

        /* run in genres round */
        findByGenre(genre)
    })

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