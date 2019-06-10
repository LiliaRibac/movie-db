let slides=[];

$(document).ready(function () {
  let movieId = getUrlParameter('movieId');
  let actorId = getUrlParameter('actorId');
  let searchResults = getUrlParameter('search');

  if (movieId !== '') {
    GetMovieDetails(`https://api.themoviedb.org/3/movie/${movieId}?api_key=08f123202c02b3f6e43980f02514a11d&language=en-US`, '.movie-details')

  } else if (actorId !== '') {
    GetActorDetails(`https://api.themoviedb.org/3/person/${actorId}?api_key=08f123202c02b3f6e43980f02514a11d&language=en-US`, '.actor-details')


  } else if(searchResults !== ''){
    GetData(`https://api.themoviedb.org/3/search/multi?query=${searchResults}&api_key=08f123202c02b3f6e43980f02514a11d`, '.search-results', 0, false );
  
  } else {
    GetData('https://api.themoviedb.org/3/movie/upcoming?api_key=08f123202c02b3f6e43980f02514a11d&page=1', '.upcoming', 0, true, '.upcoming-actors');
    GetData('https://api.themoviedb.org/3/movie/top_rated?api_key=08f123202c02b3f6e43980f02514a11d&page=1', '.top-rated', 10, false)

  }
  
})


$("#searchBtn").click(function (e) {

  let mySearch = document.getElementById('search');
  e.preventDefault()
  
  window.location.href = `search-results.html?search=${mySearch.value}`;

})

$("#goBackBtn").click(function (e) {
  e.preventDefault();
  window.location.href = `index.html`;

})

// Api Url | Div Id in HTML | How many records you want | Whether or not you want to get actors
function GetData(url, containerId, limit, getActors, actorContId) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `${url}`,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  $.ajax(settings).done(function (response) {

    if (dataType = 'movies') {
      CreatePosters(response.results, containerId, limit);

    }

    if (getActors = true) {
      GetActors(response.results, (actorContId !== undefined ? actorContId : containerId))
    }
  });
}

function GetMovieDetails(url, containerId) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `${url}`,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  $.ajax(settings).done(function (response) {
    ShowMovieDetails(response, containerId);
  });
}

function GetActorDetails(url, containerId) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": `${url}`,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  $.ajax(settings).done(function (response) {
    ShowActorDetails(response, containerId);
  });
}

function CreatePosters(results, containerId, limit) {
  slides = [];
  for (let i = 0; i < (limit !== 0 ? limit : results.length); i++) {
    let imgUrl = results[i].poster_path;
    slides.push(`"https://image.tmdb.org/t/p/w500/${imgUrl}"`);

    let poster = document.createElement('div');
    poster.innerHTML = `<a href="movie-details.html?movieId=${results[i].id}"><img class="poster" src="https://image.tmdb.org/t/p/w500/${imgUrl}"/></a>`;
    $(poster).addClass('poster');

    $(containerId).append(poster);
  }
  console.log (slides);
}

function GetActors(results, containerId) {
  for (let i = 0; i < results.length; i++) {
    let movieId = results[i].id;

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=08f123202c02b3f6e43980f02514a11d`,
      "method": "GET",
      "headers": {},
      "data": "{}"
    }

    $.ajax(settings).done(function (response) {
      ShowActors(response.cast, containerId);
    });

  }
}

function ShowActors(results, containerId) {
  for (let i = 0; i < (results.length - results.length + 1); i++) {
    let imgUrl = results[i].profile_path;

    let poster = document.createElement('div');
    poster.innerHTML = `<a href="actor-details.html?actorId=${results[i].id}"><img class="actorImg" src="https://image.tmdb.org/t/p/w500/${imgUrl}"/></a>`;
    $(poster).addClass('actorImg');

    $(containerId).append(poster);
  }
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function ShowMovieDetails(results, containerId) {
  console.log("Movie Details Page", results, containerId)

  let poster = document.createElement('div');
  poster.innerHTML = `<div style="margin:0px auto;  max-width:800px; height: 500px; width:100%; background-repeat:no-repeat; background-size:cover; background-image: url('https://image.tmdb.org/t/p/w500/${(results.backdrop_path !== undefined ? results.backdrop_path : results.poster_path)}')"></div>  
  <div style="text-align:left; padding: 30px; margin:0px auto; background-color:white; max-width:800px;"><div style="">
    <h1 class="primary-header">${results.original_title}</h1>
    <p style=" text-align:left;">${results.overview}</p>
    <div style=" display:flex; justify-content:space-between; width:80%; font-weight:bold; text-align:left; padding-top:30px;">
    <p>Release Date: ${results.release_date}</p>  
    <p> Status: ${results.status}</p> 
    <p> Vote Average: ${results.vote_average}</p>
    </div>
    </div>
    <a class="primary-btn" href="${results.homepage}">Live Site</a>
  </div>`

  $(poster).addClass('poster');
  $(containerId).append(poster);
}

function ShowActorDetails(results, containerId) {
  console.log("Actor Details Page", results, containerId)

  let poster = document.createElement('div');
  poster.innerHTML = `<div style="margin:0px auto;  max-width:800px; height: 500px; width:100%; background-repeat:no-repeat; background-size:contain; background-image: url('https://image.tmdb.org/t/p/w500/${(results.profile_path)}')"></div>  
  <div style="text-align:left; padding: 30px; margin:0px auto; background-color:white; max-width:800px;"><div style="">
    <h1 class="primary-header">${results.name}</h1>
    <p style=" text-align:left;">${results.biography}</p>
    <div style=" display:flex; justify-content:space-between; width:100%; font-weight:bold; text-align:left; padding-top:30px;">
    <p>Birthday: ${results.birthday}</p>  
    <p> Death Day: ${results.deathday}</p> 
    <p> Known For: ${results.known_for_department}</p>
    <p> Birth Place: ${results.place_of_birth}</p>
    </div>
    </div>
    <a class="primary-btn" href="https://www.imdb.com/name/${results.imdb_id}/">IMDB</a>
  </div>`

  $(poster).addClass('poster');
  $(containerId).append(poster);
}

