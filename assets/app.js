//-------------------------- basic search functionality ----------------------

const submitButtonSong = document.getElementById("submit-btn-song");
const outputDisplayP = document.getElementById("output");
let trackTreckNum; //track length @ global scope for easy reference

//variable to check and unccheck all the tracks for the playlist:
let checkAll = true;

// array for playlist:
let playlistArray = [];
let totalDuration = 0;

//M.Tabs.init(document.querySelector('.tabs'))
//Allows materialize tabs to actually appear

//click submit button on song tab
submitButtonSong.addEventListener("click", function() {
  //get values of inputs
  const startState = document.getElementById("starting-state").value;
  const startCity = document.getElementById("starting-city").value;
  const endState = document.getElementById("ending-state").value;
  const endCity = document.getElementById("ending-city").value;
  const trackName = document.getElementById("song-title").value;
  const artistName = document.getElementById("artist-name").value;

  //get form id and reset
  const songForm = document.getElementById("song-form");
  songForm.reset();

  // converts distance into number of songs
  function convertTrecktoTrack(distanceTime, trackTime) {
    const convertedDistanceTime = distanceTime;
    const convertedTrackTime = trackTime / 1000;
    trackTreckNum = Math.ceil(convertedDistanceTime / convertedTrackTime);
    console.log("This is the number of " + trackName + ": " + trackTreckNum);
    return trackTreckNum;
  }

  function checkValues(artist, track) {
    if (artist.indexOf("#") !== -1 || track.indexOf("#") !== -1) {
      return false;
    } else {
      return true;
    }
  }

  function checkDirections(fromState, fromCity, toState, toCity) {
    if (
      fromState === "" ||
      fromCity === "" ||
      toState === "" ||
      toCity === ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  //-----------------------------------------------------------------------sets up the function to get track length
  function getTrackLength(artist, track, distanceTime, cityStart, cityEnd) {
    const apiKey = "c7c92f78a10b96b8086988432a4f4cf5"; // api key for last.fm audioscrobbler

    const queryURL =
      "https://ws.audioscrobbler.com/2.0/?method=track.getInfo" +
      "&api_key=" +
      apiKey +
      "&artist=" +
      artist +
      "&track=" +
      track +
      "&format=json"; // queryURL to be used in fetch
    if (checkValues(artist, track)) {
      axios.get(queryURL).then(function(responseJson) {
        console.log(responseJson);
        if (
          responseJson.data.error ||
          responseJson.data.track.duration === "0"
        ) {
          console.log("Stop breaking our crap John.");
          console.log(responseJson);
        } else {
          console.log(responseJson); // console log json to check integrity
          const songLength = responseJson.data.track.duration; //this returns the song length
          console.log("song length:", songLength);
          convertTrecktoTrack(distanceTime, songLength);
          //writes the answer to output
          const output = document.getElementById("output");
          output.innerHTML = "";
          const outputDiv = document.createElement("div");
          outputDiv.classList.add("col", "s12");
          output.append(outputDiv);
          outputDiv.innerText =
            cityStart +
            " is " +
            trackTreckNum +
            " " +
            responseJson.data.track.name +
            "'s by " +
            artist +
            " away from " +
            cityEnd;

          //Get Album art url and save it to a variable
          document.getElementById("albums").innerHTML = "";
          const albumArtDiv = document.createElement("div");
          albumArtDiv.classList.add("col", "s6");
          const aArtURL = responseJson.data.track.album.image[1]["#text"];
          console.log(aArtURL);
          //Print album art img to screen
          const image = document.createElement("img"); //creaing image elements
          image.setAttribute("id", "aArt");
          image.setAttribute("src", aArtURL);
          image.classList.add("center-align");
          albumArtDiv.append(image);
          document.getElementById("albums").append(albumArtDiv);
        }
      });
    } else {
      console.log("Stop breaking our crap John.");
    }
  }

  function getDirectionInfo(fromState, fromCity, toState, toCity) {
    const apiKey = "1ar8EgSpyQGUCgm8HV9dyZhG7AWbPq7a";
    const queryURL =
      "https://www.mapquestapi.com/directions/v2/route?key=" +
      apiKey +
      "&from=" +
      fromCity +
      ", " +
      fromState +
      "&to=" +
      toCity +
      ", " +
      toState +
      "&unit=m";
    console.log(queryURL);
    if (checkDirections(fromState, fromCity, toState, toCity)) {
      axios.get(queryURL).then(function(responseJson) {
        console.log(responseJson);
        if (
          !responseJson.data.route.distance ||
          responseJson.data.route.locations[0].adminArea3 !==
            fromState.toUpperCase() ||
          responseJson.data.route.locations[1].adminArea3 !==
            toState.toUpperCase() ||
          responseJson.data.route.locations[0].adminArea5 === "" ||
          responseJson.data.route.locations[1].adminArea5 === ""
        ) {
          console.log(responseJson);
          console.log("Stop breaking our crap John.");
        } else {
          console.log(responseJson);
          distanceInMiles = responseJson.data.route.distance;
          distanceInKm = distanceInMiles * 1.609344;
          driveTime = responseJson.data.route.time; //returns drive time in minutes
          driveTimeMin = driveTime / 60; //converting drive time to minutes from seconds

          console.log("drive time: ", driveTime);
          console.log("distance in miles: ", distanceInMiles);
          console.log("distance in km: ", distanceInKm.toFixed(2));
          getTrackLength(artistName, trackName, driveTime, fromCity, toCity); //runs the trackLength function
          const driveAndTime = document.getElementById("driveAndTime");
          driveAndTime.innerHTML = "";
          const driveAndTimeText = document.createElement("div");
          driveAndTimeText.classList.add("col", "s12");
          driveAndTimeText.innerHTML =
            "<br/>Drive time in minutes: " +
            driveTimeMin.toFixed(2) +
            "</br>Distance in miles: " +
            distanceInMiles.toFixed(2) +
            "<br/> Distance in km: " +
            distanceInKm.toFixed(2);
          driveAndTime.append(driveAndTimeText);
        }
      });
    } else {
      console.log("Stop breaking our crap John.");
    }
  }
  getDirectionInfo(startState, startCity, endState, endCity); //runs the get direction info
});

//gets top album from an artist
function searchAlbums(artist) {
  let apiKey = "c7c92f78a10b96b8086988432a4f4cf5";

  let queryURL =
    "https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&api_key=" +
    apiKey +
    "&artist=" +
    artist +
    "&format=json";
  if (checkAlbum(artist)) {
    axios.get(queryURL).then(function(responseJson) {
      if (
        responseJson.data.error ||
        responseJson.data.topalbums.album.length === 0
      ) {
        // Add back button code here so user can easily go back to previous page

        //work on removing code to elimiate forward and back buttons

        const backToSearchBtn = document.createElement("button");
        const backBtnArea = document.createElement("div");
        backBtnArea.classList.add("col", "s6");
        backBtnArea.setAttribute("id", "back-btn-area");

        //backToSearch button
        backToSearchBtn.innerText = "< Back";
        backToSearchBtn.classList.add("btn");

        backToSearchBtn.addEventListener("click", function() {
          document.getElementById("playlist-form").style.display = "block";
          document.getElementById("prevNext").style.display = "none";
          document.getElementById("answer").style.display = "none";
        });
        const prevNext = document.getElementById("prevNext");
        prevNext.classList.add("col", "s12");
        prevNext.innerHTML = "";
        prevNext.append(backBtnArea);
        backBtnArea.append(backToSearchBtn);

        console.log("Stop breaking our crap John.");
        console.log(responseJson);
      } else {
        console.log(responseJson);

        const artistSave = responseJson.data.topalbums["@attr"].artist;
        const albumArray = responseJson.data.topalbums.album;

        const answerDiv = document.getElementById("answer");
        answerDiv.innerHTML = "";
        answerArea = document.createElement("div");
        answerDiv.append(answerArea);

        //sets up function to displays the list of albums
        let indexNum = 0;
        function displayAlbums(index) {
          //displays the i + 4 albums
          j = index + 6;

          const answerUL = document.createElement("ul");
          answerArea.append(answerUL);
          for (i = index; i < j; i++) {
            if (albumArray[i].name !== "(null)") {
              const answerLI = document.createElement("li");
              answerLI.setAttribute("dta-album", albumArray[i].name);
              answerLI.classList.add("valign-wrapper");
              const answerImg = document.createElement("img");

              answerImg.setAttribute("src", albumArray[i].image[1]["#text"]);
              answerImg.setAttribute("data-album", albumArray[i].name);
              answerImg.setAttribute("data-artist", artist);
              answerImg.classList.add("album-art", "z-depth-2");

              answerLI.prepend(answerImg);
              answerLI.append(albumArray[i].name);

              answerUL.append(answerLI);

              answerLI.addEventListener("click", function(event) {
                albumSearch = event.target.getAttribute("data-album");
                //runs the get track length function
                getTrackLength(artist, albumSearch, artistSave);

                //hide the form
                const playlistFormHideSelector = document.getElementById(
                  "playlist-form"
                );
                playlistFormHideSelector.style.display = "none";
              });
            }
          }
        }
        displayAlbums(indexNum);
        const nextBtn = document.createElement("button");
        const prevBtn = document.createElement("button");
        const backToSearchBtn = document.createElement("button");
        const backBtnArea = document.createElement("div");
        backBtnArea.classList.add("col", "s6");
        backBtnArea.setAttribute("id", "back-btn-area");
        const prevNextArea = document.createElement("div");
        prevNextArea.classList.add("col", "s6");
        prevNextArea.setAttribute("id", "prev-next-area");
        //next button
        nextBtn.innerText = ">";
        nextBtn.classList.add("btn");
        //previous button
        prevBtn.innerText = "<";
        prevBtn.classList.add("btn");
        //backToSearch button
        backToSearchBtn.innerText = "< Back";
        backToSearchBtn.classList.add("btn");

        //previous/next button event listeners
        nextBtn.addEventListener("click", function() {
          if (indexNum < 40) {
            indexNum = indexNum + 7;
            answerArea.innerHTML = "";
            displayAlbums(indexNum);
          }
        });
        prevBtn.addEventListener("click", function() {
          if (indexNum > 0) {
            indexNum = indexNum - 7;
            answerArea.innerHTML = "";
            displayAlbums(indexNum);
          }
        });
        backToSearchBtn.addEventListener("click", function() {
          document.getElementById("playlist-form").style.display = "block";
          document.getElementById("prevNext").style.display = "none";
          document.getElementById("answer").style.display = "none";
        });
        const prevNext = document.getElementById("prevNext");
        prevNext.classList.add("col", "s12");
        prevNext.innerHTML = "";
        prevNext.append(backBtnArea);
        prevNext.append(prevNextArea);
        backBtnArea.append(backToSearchBtn);
        prevNextArea.append(prevBtn);
        prevNextArea.append(nextBtn);
      }
    });
  } else {
    console.log("Stop breaking our crap John");
  }
}

//gets list of tracks in an album and their lengths
function getTrackLength(artist, album, artistToSave) {
  const artistBack = artistToSave;
  //perform the query
  const apiKey = "c7c92f78a10b96b8086988432a4f4cf5";
  const queryURL =
    "https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" +
    apiKey +
    "&artist=" +
    artist +
    "&album=" +
    album +
    "&format=json";

  axios.get(queryURL).then(function(responseJson) {
    console.log(responseJson);
    let trackArray = responseJson.data.album.tracks.track;

    let trackTimes = [];

    const answerDiv = document.getElementById("answer");
    answerDiv.innerHTML = "";

    document.getElementById("prev-next-area").style.display = "none";
    document.getElementById("back-btn-area").style.display = "none";

    //create back button
    const backBtn = document.createElement("button");
    backBtn.classList.add("btn");
    backBtn.innerText = "< Back";
    prevNext.prepend(backBtn);

    const selectallDiv = document.getElementById("selectalltracks");
    selectallDiv.innerHTML = "";

    // creates a button to select/unselect ALL tracks from album:
    const checkBoxAll = document.createElement("button");
    checkBoxAll.classList.add("btn");
    checkBoxAll.innerText = "Select all tracks";
    checkBoxAll.setAttribute("onclick", "selectAllTracks()");
    checkBoxAll.setAttribute("id", "checkBoxAll");
    selectallDiv.append(checkBoxAll);
    const answerUL = document.createElement("ul");
    answerDiv.append(answerUL);

    //displays the tracks on the page
    for (i = 0; i < trackArray.length; i++) {
      console.log(trackArray[i].name);

      let checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");
      checkBox.setAttribute("id", "0" + i);
      checkBox.setAttribute("class", "filled-in");
      checkBox.setAttribute("data-album", responseJson.data.album.name);
      checkBox.setAttribute("data-artist", responseJson.data.album.artist);
      checkBox.setAttribute("data-track", trackArray[i].name);
      checkBox.setAttribute("data-duration", trackArray[i].duration);

      // check if the music is already in the playlist, if it is, the ckeckbox will appear marked:
      checkBox.setAttribute("onclick", "updatePlaylist(this)");
      for (let j = 0; j < playlistArray.length; j++) {
        if (
          playlistArray[j].album === responseJson.data.album.name &&
          playlistArray[j].artist === responseJson.data.album.artist &&
          playlistArray[j].track === trackArray[i].name &&
          playlistArray[j].duration === trackArray[i].duration
        ) {
          checkBox.setAttribute("checked", "true");
          break;
        }
      }

      let checkBoxLabel = document.createElement("label");
      checkBoxLabel.setAttribute("for", "0" + i);
      checkBoxLabel.innerText = "";

      const answerLI = document.createElement("li");
      answerLI.classList.add("valign-wrapper");
      answerLI.append(checkBox);
      answerLI.append(checkBoxLabel);
      answerLI.append(trackArray[i].name);
      answerLI.append(" - ");
      answerLI.append(convertTime(trackArray[i].duration));
      answerUL.append(answerLI);
      trackTimes.push(parseInt(trackArray[i].duration));
    }

    backBtn.addEventListener("click", function() {
      answerDiv.innerHTML = "";
      document.getElementById("answer").style.display = "block";
      document.getElementById("prevNext").style.display = "block";
      document.getElementById("checkBoxAll").style.display = "none";
      console.log(artistBack);
      searchAlbums(artistBack);
    });

    console.log(trackTimes);
    console.log(trackTimes.reduce((a, b) => a + b, 0));
  });
}

// function for select/unselect ALL the tracks from the album:
function selectAllTracks() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = checkAll;
    // update the playlist with the new state of checkbox:
    updatePlaylist(checkboxes[i]);
  }
  checkAll = !checkAll;
}

function convertTime(time) {
  const hr = ~~(time / 3600);
  const min = ~~((time % 3600) / 60);
  const sec = time % 60;
  let sec_min = "";
  if (hr > 0) {
    sec_min += "" + hr + ":" + (min < 10 ? "0" : "");
  }
  sec_min += "" + min + ":" + (sec < 10 ? "0" : "");
  sec_min += "" + sec;
  return sec_min;
}

function checkAlbum(artist) {
  if (artist.indexOf("#") !== -1) {
    return false;
  } else {
    return true;
  }
}

//-----------------------triggers the search for search by artist ------------------
document
  .getElementById("submit-btn-artist")
  .addEventListener("click", function() {
    const startState = document.getElementById("starting-state2").value;
    const startCity = document.getElementById("starting-city2").value;
    const endState = document.getElementById("ending-state2").value;
    const endCity = document.getElementById("ending-city2").value;
    const artistInput = document.getElementById("artist").value;

    console.log("Heres the artist:" + artistInput);
    searchAlbums(artistInput);

    //reset the playlist form
    document.getElementById("playlist-form").style.display = "none";
    document.getElementById("prevNext").style.display = "block";
    document.getElementById("answer").style.display = "block";

    function convertTime(time) {
      const hr = ~~(time / 3600);
      const min = ~~((time % 3600) / 60);
      const sec = time % 60;
      let sec_min = "";
      if (hr > 0) {
        sec_min += "" + hr + ":" + (min < 10 ? "0" : "");
      }
      sec_min += "" + min + ":" + (sec < 10 ? "0" : "");
      sec_min += "" + sec;
      return sec_min;
    }

    function getDirectionInfo(fromState, fromCity, toState, toCity) {
      const apiKey = "1ar8EgSpyQGUCgm8HV9dyZhG7AWbPq7a";
      const queryURL =
        "https://www.mapquestapi.com/directions/v2/route?key=" +
        apiKey +
        "&from=" +
        fromCity +
        ", " +
        fromState +
        "&to=" +
        toCity +
        ", " +
        toState +
        "&unit=m";
      console.log(queryURL);

      function checkDirections(fromState, fromCity, toState, toCity) {
        if (
          fromState === "" ||
          fromCity === "" ||
          toState === "" ||
          toCity === ""
        ) {
          return false;
        } else {
          return true;
        }
      }
      if (checkDirections(fromState, fromCity, toState, toCity)) {
        axios.get(queryURL).then(function(responseJson) {
          if (
            !responseJson.data.route.distance ||
            responseJson.data.route.locations[0].adminArea3 !==
              fromState.toUpperCase() ||
            responseJson.data.route.locations[1].adminArea3 !==
              toState.toUpperCase() ||
            responseJson.data.route.locations[0].adminArea5 === "" ||
            responseJson.data.route.locations[1].adminArea5 === ""
          ) {
            console.log(responseJson);
            console.log("Stop breaking our crap John.");
          } else {
            console.log(responseJson);
            distanceInMiles = responseJson.data.route.distance;
            distanceInKm = distanceInMiles * 1.609344;
            driveTime = responseJson.data.route.time; //returns drive time in minutes
            driveTimeMin = driveTime / 60; //converting drive time to minutes from seconds

            console.log("drive time: ", driveTime);
            console.log("distance in miles: ", distanceInMiles);
            console.log("distance in km: ", distanceInKm.toFixed(2));
            // getTrackLength(artistName, trackName, driveTime, fromCity, toCity); //runs the trackLength function
            setTreck(fromState, fromCity, toState, toCity, driveTime);
          }
        });
      } else {
        console.log("Stop breaking our crap John.");
      }
    }
    getDirectionInfo(startState, startCity, endState, endCity);
  });

// ----------------- the trip duration localforage starts here: -----------------------

function setTreck(fromState, fromCity, toState, toCity, duration) {
  const treck = {
    treckFromState: fromState,
    treckFromCity: fromCity,
    treckToState: toState,
    treckToCity: toCity,
    treckDuration: duration
  };

  // save the starting & ending location and trip duration
  localforage.setItem("treck-data", treck);
}

function getTreck() {
  let data = localforage.getItem("treck-data").then(function(value) {
    if (value === null) {
      treckFromState = "";
      treckFromCity = "";
      treckToState = "";
      treckToCity = "";
      treckDuration = 0;
    } else {
      const treckFromState = value.treckFromState;
      const treckFromCity = value.treckFromCity;
      const treckFromCityToLower = treckFromCity.toLowerCase();
      const lowerTreckFromCity =
        treckFromCityToLower.charAt(0).toUpperCase() +
        treckFromCityToLower.substring(1);
      const treckToState = value.treckToState;
      const treckToCity = value.treckToCity;
      const treckToCityToLower = treckToCity.toLowerCase();
      const lowerTreckToCity =
        treckToCityToLower.charAt(0).toUpperCase() +
        treckToCityToLower.substring(1);
      const treckDuration = value.treckDuration;

      document.getElementById("timeRemain").innerHTML =
        "<strong>Your trip from " +
        lowerTreckFromCity +
        " to " +
        lowerTreckToCity +
        " is: " +
        convertTime(treckDuration) +
        "</strong>.";
    }
  });
}

// ----------------- the playlist and localforage start here: ---------------------

// function to add and remove tracks to playlist by the checked checkbox:
// NOTE: "track" is the checkbox that was clicked!
function updatePlaylist(track) {
  const item = {
    album: track.getAttribute("data-album"),
    artist: track.getAttribute("data-artist"),
    track: track.getAttribute("data-track"),
    duration: track.getAttribute("data-duration")
  };
  if (track.checked) {
    // track was selected:
    playlistArray.push(item);
    totalDuration += parseInt(item.duration);
  } else {
    // this variable creates a temporary playlist without the removed track that was unchecked;
    // we are creating a variable to receive the itens that still remain checked, looks inefficient, but it works!
    let tmpPlaylist = [];
    totalDuration = 0;
    for (arrayitem of playlistArray) {
      if (
        item.album === arrayitem.album &&
        item.artist === arrayitem.artist &&
        item.track === arrayitem.track &&
        item.duration === arrayitem.duration
      ) {
        console.log(
          "Removing " +
            arrayitem.album +
            "," +
            arrayitem.artist +
            "," +
            arrayitem.track +
            "," +
            item.duration +
            "."
        );
      } else {
        tmpPlaylist.push(arrayitem);
        totalDuration += parseInt(item.duration);
      }
    }
    playlistArray = tmpPlaylist;
  }

  // create Json structure with total time and playlist:
  let playlistData = {
    totalTime: totalDuration,
    finalPlaylist: playlistArray
  };

  // save the playlist and total time:
  localforage.setItem("playlist-data", playlistData);

  function updateProg() {
    let progSong = totalDuration;
    let progTrip = driveTimeMin;
    progPercent = Math.round((progSong / progTrip) * 100);
    document.getElementById("progBar").style.width = progPercent + "%";
    console.log(progPercent);
  }
  try {
    updateProg();
  } catch {}
}

// function to get the tracks from the localForage:
function getPlaylistData() {
  let data = localforage.getItem("playlist-data").then(function(value) {
    if (value === null) {
      totalDuration = 0;
      playlistArray = [];
    } else {
      totalDuration = value.totalTime;
      playlistArray = value.finalPlaylist;
    }
    document.getElementById("playlistTime").innerHTML =
      "<strong>Your playlist duration is: " +
      convertTime(totalDuration) +
      "</strong>.";

    // variable to create a div for the button "clearPlaylist":
    const clearPlaylistDiv = document.getElementById("clearPlaylist");
    clearPlaylistDiv.innerHTML = "";

    if (playlistArray.length > 0) {
      // creates a button to clear all the tracks from the playlist/localForage:
      const clearPlaylist = document.createElement("a");
      clearPlaylist.classList.add(
        "waves-effect",
        "btn",
        "waves-light",
        "btn",
        "modal-trigger"
      );
      clearPlaylist.innerText = "Clear Playlist";
      clearPlaylist.setAttribute("href", "#clear-playlist-modal");
      clearPlaylistDiv.append(clearPlaylist);
    }
    renderPlaylist();
    renderDifference();
  });
}

// function to clear the playlist/localForage content by clicking button:
function clearPlaylist() {
  totalDuration = 0;
  playlistArray = [];
  let playlistData = {
    totalTime: totalDuration,
    finalPlaylist: playlistArray
  };
  // erase the db and update the playlist on display:
  localforage.setItem("playlist-data", playlistData).then(getPlaylistData);
  checkAll = true;
}

// function that render every element of playlist array into the table in HTML:
function renderPlaylist() {
  const playlistTableBody = document.getElementById("playlist-table-body");
  playlistTableBody.innerHTML = "";
  for (let i = 0; i < playlistArray.length; i++) {
    const trackTR = document.createElement("tr");
    const artistTD = document.createElement("td");
    const albumTD = document.createElement("td");
    const trackTD = document.createElement("td");
    const durationTD = document.createElement("td");
    let track = playlistArray[i];

    // Showing the datas into the HTML table:
    artistTD.innerText = track.artist;
    albumTD.innerText = track.album;
    trackTD.innerText = track.track;
    durationTD.innerText = convertTime(parseInt(track.duration));

    // Appending all the td to tr:
    trackTR.append(artistTD);
    trackTR.append(albumTD);
    trackTR.append(trackTD);
    trackTR.append(durationTD);

    // Appending all the tr to table body:
    playlistTableBody.append(trackTR);
  }
}

// ----------------- the playlist and localforage finish here: ---------------------

// TODO: create a function that allows the user see the checkboxes checked, to avoid double selection.
// TODO: include the album URL to see the album image with the playlist.

function renderDifference() {
  // const remainingTimeDiv = document.getElementById("timeRemain");
  let data = localforage.getItem("playlist-data").then(function(playlist) {
    let data2 = localforage.getItem("treck-data").then(function(treck) {
      console.log(playlist.totalTime, typeof playlist.totalTime);
      console.log(treck.treckDuration, typeof treck.treckDuration);
      if (playlist === null || treck === null) {
        remainingTimeDiv.innerHTML = "No playlist or trip data";
      } else {
        let remainingTime = treck.treckDuration - playlist.totalTime;
        remainingTime = convertTime(remainingTime);
        console.log(remainingTime);
        let remainingPercent = Math.round(
          (playlist.totalTime / treck.treckDuration) * 100
        );
        document.getElementById("progBar").style.width = remainingPercent + "%";
        // remainingTimeDiv.innerHTML = "<strong> Remaining Time: " + remainingTime + "</strong>";
      }
    });
  });
}
