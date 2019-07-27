
$(document).ready(function () {
    const getImg = "https://image.tmdb.org/t/p/w300";
    const notImg = "https://rimage.gnst.jp/livejapan.com/public/img/common/noimage.jpg?20190126050038";
    const mainContainer = $("#mainContainer");
    const box = $("#box");
    var check = "main";
    var currentUrl;




    request(`https://api.themoviedb.org/3/discover/movie?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US&page=1`, getFilm);
    $("#home").on("click", function () {
        check = "main";
        box.empty();
        request(`https://api.themoviedb.org/3/discover/movie?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US&page=1`, getFilm);
    });
    $("#popularity").on("click", function () {
        box.empty();
        request(`https://api.themoviedb.org/3/trending/all/day?api_key=a6d1d983093553c5ff65869ed9bf8cc4`, getFilm);
    });
    $("#movie").on("click", function () {
        check = "movie";
        filter();
        request(`https://api.themoviedb.org/3/discover/movie?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US&page=1`, getFilm);

    });
    $("#tv").on("click", function () {
        check = "tv";
        filter();
        request(`https://api.themoviedb.org/3/discover/tv?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US&page=1`, getFilm);
    });
    $("#search").on("click", function () {
        check = "search";
        box.empty();
       let searchName = $("#searchValue").val();
       request(`https://api.themoviedb.org/3/search/multi?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US&query=${searchName}&page=1`, getFilm);
    });

    function request(url, func){
        $.ajax({
            method:"GET",
            url: url,
            assign:true,
            success: function (data) {
                console.log(data);
                func(data);
            },
            error: function () {
                alert("Щось пішло не так!!")
            }
        })
    }


    function getFilm(data) {
        console.log(data);
        mainContainer.empty();
        data.results.forEach(function (item) {
            let img;
            if (item.poster_path === null) {
                img = notImg;
            }else {
                img = getImg + item.poster_path;
            }
            mainContainer.append(`    
            <div class="card text-white d-flex flex-row bg-dark mb-3 w-100" style="height: 100%">
                <img src="${img}" class="card-img-top" alt="..." style="max-width: 300px">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <h5 class="card-title">${item.name || item.title}</h5>
                        <p class="card-text">Rating <span class="badge badge-success">${item.vote_average}</span></p>
                        <p class="card-text"><small>Release date: ${item.first_air_date || item.release_date}</small></p>
                        <p class="card-text">${item.overview}</p>
                    </div>
                    <a href="#" class="btn btn-success">Go somewhere</a>
                </div>
            </div>`);
        });
        mainContainer.append(`
        <div class="d-flex flex-row justify-content-around align-items-center">
        <button type="button" id="back" class="btn">Back</button>
        <span class="form-control"> ${data.page} of ${data.total_pages}</span>
        <button type="button" id="next" class="btn">Next</button>
        </div>
               `);
        pagination(data.page, data.total_pages);

    }

    function pagination(currentPage, allPage ) {
        $("#next").on("click", function () {
            let sorting = $("#select").val();
            let year = $("#year").val();
            if (year !== ""){
                if(check === "tv"){
                    year = "&first_air_date_year=" + year;
                }else{
                    year = "&year=" + year;
                }
            }
            console.log(year);
            let ratingMin = $("#ratingMin").val();
            if (ratingMin !== ""){
                ratingMin = "&vote_average.gte=" + ratingMin;
            }
            console.log(ratingMin);
            let ratingMax = $("#ratingMax").val();
            if (ratingMax !== ""){
                ratingMax = "&vote_average.lte=" + ratingMax;
            }
            if (currentPage === allPage){
                currentPage = 1;
            } else {
                currentPage++;
                if(check === "main"){
                    request(`https://api.themoviedb.org/3/discover/movie?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US&page=${currentPage}`, getFilm);
                }else if(check === "movie"){
                    request(`https://api.themoviedb.org/3/discover/movie?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US${sorting}${year}&page=${currentPage}${ratingMin}${ratingMax}`, getFilm);
                }else if(check === "tv"){
                    request(`https://api.themoviedb.org/3/discover/tv?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US${sorting}${year}&page=${currentPage}${ratingMin}${ratingMax}`, getFilm);
                }else if(check === "search"){
                    let searchName = $("#searchValue").val();
                    request(`https://api.themoviedb.org/3/search/multi?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US&query=${searchName}&page=${currentPage}`, getFilm);
                }
            }
        });
        $("#back").on("click", function () {
            let sorting = $("#select").val();
            let year = $("#year").val();
            if (year !== ""){
                if(check === "tv"){
                    year = "&first_air_date_year=" + year;
                }else{
                    year = "&year=" + year;
                }
            }
            console.log(year);
            let ratingMin = $("#ratingMin").val();
            if (ratingMin !== ""){
                ratingMin = "&vote_average.gte=" + ratingMin;
            }
            console.log(ratingMin);
            let ratingMax = $("#ratingMax").val();
            if (ratingMax !== ""){
                ratingMax = "&vote_average.lte=" + ratingMax;
            }
            if (currentPage === 1){
                currentPage = allPage - 1;
            } else {
                currentPage--;
                if(check === "main"){
                    request(`https://api.themoviedb.org/3/discover/movie?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US&page=${currentPage}`, getFilm);
                }else if(check === "movie"){
                    request(`https://api.themoviedb.org/3/discover/movie?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US${sorting}${year}&page=${currentPage}${ratingMin}${ratingMax}`, getFilm);
                }else if(check === "tv"){
                    request(`https://api.themoviedb.org/3/discover/tv?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US${sorting}${year}&page=${currentPage}${ratingMin}${ratingMax}`, getFilm);
                }else if(check === "search"){
                    let searchName = $("#searchValue").val();
                    request(`https://api.themoviedb.org/3/search/multi?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US&query=${searchName}&page=${currentPage}`, getFilm);
                }
            }
        });
    }

    function filter() {
        box.empty();
        box.html(`<div id="filter" class="container shadow-sm rounded-sm p-3 bg-dark mt-3 d-flex flex-row justify-content-between align-items-center">
           Sorting: <select id="select" class="form-control  mr-2">
                <option id="option1" value="&sort_by=popularity.desc">By popularity</option>
                <option id="option2" value="&sort_by=vote_average.desc">By rating</option>
                <option id="option3" value="&sort_by=first_air_date.desc">By date of release</option>
            </select>
            Year: <input id="year" class="form-control mr-2" type="number" placeholder="Year" min="1960" max="2025">
             Rating:<div class="mr-2" style="width: 25rem">
         
                <input id="ratingMin" class="form-control mb-1" type="number" min="0" max="10" placeholder="min 0">
                <input id="ratingMax" class="form-control" type="number" min="0" max="10" placeholder="max 10">
            </div>
            <button id="filterBtn" type="button" class="btn btn-dark btn-outline-success">Filter</button>
            </div>`);
        $("#filterBtn").on("click", function () {
            let sorting = $("#select").val();
            let year = $("#year").val();
            if (year !== ""){
                if(check === "tv"){
                    year = "&first_air_date_year=" + year;
                }else{
                    year = "&year=" + year;
                }

            }
            console.log(year);
            let ratingMin = $("#ratingMin").val();
            if (ratingMin !== ""){
                ratingMin = "&vote_average.gte=" + ratingMin;
            }
            console.log(ratingMin);
            let ratingMax = $("#ratingMax").val();
            if (ratingMax !== ""){
                ratingMax = "&vote_average.lte=" + ratingMax;
            }
            console.log(ratingMax);
            if (check === "movie"){
                request(`https://api.themoviedb.org/3/discover/movie?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US${sorting}&page=1${ratingMin}${ratingMax}${year}`, getFilm);
            }else if (check === "tv"){
                request(`https://api.themoviedb.org/3/discover/tv?api_key=a6d1d983093553c5ff65869ed9bf8cc4&language=en-US${sorting}${year}&page=1${ratingMin}${ratingMax}`, getFilm);
            }
        });
    }
});



