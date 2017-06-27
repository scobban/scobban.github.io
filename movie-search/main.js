// Lets create a movie app that will accept a search and return a list of results
/*

1) Accept a query from the user and get results. (All via AJAX... duhhhh)
2) I want it to display the results by outputting the movie posters as image tags
3) Upon interacting with the movie poster (click, mouseover, etc..) you should display 4 extra pieces 
  of information about that movie. I don't care which
4) Bonus: Display a total of 8 pieces of information about the movie
5) Bonus: Do a type ahead so that the form works as autocomplete. 
6) Bonus: Make it pretty

// Homework
// Try the above stuff
// 


Example endpoint: http://www.omdbapi.com/?i=tt3896198&apikey=ada5c403

*/

'use strict';
var MovieApp = {};

var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

MovieApp.compileItem = function(template, item) {
    var source = template.html();
    var template = Handlebars.compile(source);
    return template(item);
}

MovieApp.addToTemplate = function(type, title, year, poster, id, link) {
    var movieTemplate = $("#movie-template");
    var movieList = $(".movie-output");
    var movieObject = {
        poster: poster,
        title: title,
        year: year,
        type: type,
        id: id,
        link: link
    };
    var compiledMovie = MovieApp.compileItem(movieTemplate, movieObject);
    movieList.append(compiledMovie);
}

MovieApp.infoPanel = function(barCalc, rating, mpaa, runtime, plot) {
    var panelTemplate = $("#modal-template");
    var panelWrap = $(".panel-wrap");
    var panelObject = {
        barWidth: barCalc,
        rating: rating,
        mpaa: mpaa,
        runtime: runtime,
        plot: plot
    };
    var compiledPanel = MovieApp.compileItem(panelTemplate, panelObject);
    panelWrap.append(compiledPanel);
}

// This is the same as document ready btw.
$(function() {

    $("#movie_search").focus();

    var omdbUrl = "https://www.omdbapi.com";
    var omdbKey = "ada5c403";
    var resultsError = $("<h3 class='response-message'>No movies were found for this search. Give it another shot.</h3>");
    var pagingError = $("<h3>No more results.</h3>");
    var tempMoviePoster = "https://movie-upload.appspot.com/images/datastore?id=NoImageAvailable"

    var inputVal;

    $("body").submit(function() {
        return false;
    });

    $("body").on("keyup", "#movie_search", function(event) {

        $(".movie-output").html("");

        $(".response-message").remove();

        inputVal = $('#movie_search').val();
        if (inputVal == "") {
            return;
        }
        var request = $.ajax({
            url: omdbUrl,
            data: {
                s: inputVal,
                page: "1",
                apikey: omdbKey
            }
        });

        delay(function() {

            request.done(function(data) {
                var movies = data.Search;
                if (movies == undefined || movies == 'undefined') {
                    $(resultsError).appendTo(".head");
                    return;
                }
                for (var i = 0; i < movies.length; i++) {
                    var moviePoster = movies[i].Poster;
                    var movieTitle = movies[i].Title;
                    var movieType = movies[i].Type;
                    var movieYear = movies[i].Year;
                    var movieID = movies[i].imdbID;
                    if (moviePoster == "N/A") {
                        var moviePoster = tempMoviePoster;
                    }
                    var posterHtml = "<img class='poster' data-type='" + movieType + "' data-title='" + movieTitle + " 'data-year='" + movieYear + "' data-imdbid='" + movieID + "' src='" + moviePoster + "'>";
                    var movieUrl = "http://www.imdb.com/title/" + movieID;
                    MovieApp.addToTemplate(movieType, movieTitle, movieYear, moviePoster, movieID, movieUrl);
                };
    
                $("#more-results").show();

            }).fail(function(data) {
                $("body").append("<div class='alert'>There was an error. Please try again.</div>");
            });

        }, 200);

    });

    $("body").on("click touchstart", ".poster", function() {

        var currentID = $(this).data("imdbid");
        var parentDiv = $(this).parents(".movie-item");

        var request = $.ajax({
            url: omdbUrl,
            data: {
                i: currentID,
                plot: "short",
                apikey: omdbKey
            }
        });

        request.done(function(data) {
            var calcWidth = data.imdbRating * 10 + '%';
            MovieApp.infoPanel(calcWidth, data.imdbRating, data.Rated, data.Runtime, data.Plot);
            $(".bar-segment").animate({
                width: calcWidth
            }, 500);
        });

        $(".panel-wrap").html("").hide();
        $(".panel-wrap").prependTo(parentDiv).fadeIn("fast");

    });

    $("body").on("click", ".close", function() {
        $(".panel-wrap").html("").hide().appendTo("body");
    });

    var nextPage = "2";

    $("body").on("click", "#more-results", function() {
        var request = $.ajax({
            url: omdbUrl,
            data: {
                s: inputVal,
                page: nextPage,
                apikey: omdbKey
            }
        });
        request.done(function(data) {
            var movies = data.Search;
            if (movies == undefined || movies == 'undefined') {
                $("#more-results").removeClass("full-btn").addClass("no-more-message").text("No more results. You have them all already.");
                return;
            }
            for (var i = 0; i < movies.length; i++) {
                var moviePoster = movies[i].Poster;
                var movieTitle = movies[i].Title;
                var movieType = movies[i].Type;
                var movieYear = movies[i].Year;
                var movieID = movies[i].imdbID;
                if (moviePoster == "N/A") {
                    var moviePoster = "https://movie-upload.appspot.com/images/datastore?id=NoImageAvailable"
                }
                var posterHtml = "<img class='poster' data-type='" + movieType + "' data-title='" + movieTitle + " 'data-year='" + movieYear + "' data-imdbid='" + movieID + "' src='" + moviePoster + "'>";
                var movieUrl = "http://www.imdb.com/title/" + movieID;
                MovieApp.addToTemplate(movieType, movieTitle, movieYear, moviePoster, movieID, movieUrl);
            };
        });
        
        nextPage++;

    });

});
