console.log("Lets write some JavaScript");
let currentSong = new Audio();

async function getSongs() {
  // Fetching songs from the Directory "Songs"
  let a = await fetch("http://127.0.0.1:3000/Web_Dev/Spotify_Clone/Songs/");

  // Parsing it as text
  let respone = await a.text();

  // Creating a div and passing the text as its HTML
  let div = document.createElement("div");
  div.innerHTML = respone;

  // Fetching all 'a' that end with the file type
  // and adding those links to an empty array
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("unknown")) {
      songs.push(element.href.split("/Songs/")[1]);
    }
  }

  return songs;
}

const playMusic = (track) => {
  let songName = track
    .querySelector(".aboutSong")
    .getElementsByTagName("div")[0]
    .getElementsByTagName("p")[0]
    .innerHTML.trim();
  let artistName = track
    .querySelector(".aboutSong")
    .getElementsByTagName("div")[0]
    .getElementsByTagName("p")[1]
    .innerHTML.trim();
  let song_info = songName + "$" + artistName;
  let TrackName = song_info.replaceAll(" ", "_");
  currentSong.src = "/Web_Dev/Spotify_Clone/Songs/" + TrackName + ".unknown";
  currentSong.play();
  document.getElementById("play").src = "pause.svg";
};

async function main() {
  let songs = await getSongs();
  // console.log(songs)
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    let li = document.createElement("li");
    li.innerHTML = ` <div class="aboutSong">
                            <img src="music.svg" alt="">
                            <div>
                                <p>${song
                                  .split("$")[0]
                                  .replaceAll("_", " ")}</p>
                                <p>${song
                                  .split("$")[1]
                                  .split(".")[0]
                                  .replaceAll("_", " ")}</p>
                            </div>
                            </div>
                            <div class="PlayNow">
                                <p>Play Now</p>
                                <img src="play.svg" alt="" class="invert">
                        </div>`;
    // li.innerHTML= song
    songUL.appendChild(li);
    // songUL.innerHTML =songUL.innerHTML + song;
  }

  //Attach event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((element) => {
    element.addEventListener("click", (e) => {
      playMusic(element);
      // console.log(element);
      console.log(element.querySelectorAll("p")[0]);

      document.getElementById("trackName").innerHTML =
        element.querySelectorAll("p")[0].innerHTML;
      document.getElementById("artistName").innerHTML =
        element.querySelectorAll("p")[1].innerHTML;

      //listen for time update events

      currentSong.addEventListener("timeupdate", () => {
        // if(currentSong.currentTime> currentSong.duration){
        //   document.getElementById("play").src = "pause.svg";
        //   currentSong.pause()
        // }
        document.querySelector(".circle").style.left =(currentSong.currentTime/currentSong.duration)*100 +"%";
        let curtimeMin = Math.floor(Math.ceil(currentSong.currentTime) / 60);
        let curtimeSec = Math.ceil(currentSong.currentTime) % 60;
        let totaltimeMin = Math.floor(Math.ceil(currentSong.duration) / 60);
        let totaltimeSec = Math.ceil(currentSong.duration) % 60;
        if (curtimeMin < 10) {
          document.getElementsByClassName(
            "time"
          )[0].innerHTML = `0${curtimeMin}`;
        } else {
          document.getElementsByClassName(
            "time"
          )[0].innerHTML = `${curtimeMin}`;
        }

        if (curtimeSec < 10) {
          document.getElementsByClassName(
            "time"
          )[0].innerHTML += `:0${curtimeSec}`;
        } else {
          document.getElementsByClassName(
            "time"
          )[0].innerHTML += `:${curtimeSec}`;
        }

        if (totaltimeMin < 10) {
          document.getElementsByClassName(
            "time"
          )[0].innerHTML += `/0${totaltimeMin}`;
        } else {
          document.getElementsByClassName(
            "time"
          )[0].innerHTML += `${totaltimeMin}`;
        }

        if (totaltimeSec < 10) {
          document.getElementsByClassName(
            "time"
          )[0].innerHTML += `:0${totaltimeSec}`;
        } else {
          document.getElementsByClassName(
            "time"
          )[0].innerHTML += `:${totaltimeSec}`;
        }
      });
    });
  });

  //Attach an event listener to each play,next and prev buttons
  //on the seek bar

  document.getElementById("play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("play").src = "pause.svg";
    } else {
      currentSong.pause();
      document.getElementById("play").src = "play.svg";
    }
  });

  document.getElementById("prevSong").addEventListener("click", () => {
    async function prevSong() {
      let songs = await getSongs();
      let playing = currentSong.src.split("/Songs/")[1];

      for (let index = 0; index < songs.length; index++) {
        const element = songs[index];
        if (element == playing) {
          if (index == 0) {
            index = songs.length - 1;
          } else {
            index = index - 1;
          }
          document.getElementById("trackName").innerHTML =songs[index].split("$")[0].replaceAll("_"," ");
          document.getElementById("artistName").innerHTML =songs[index].split("$")[1].replaceAll("_"," ").split(".")[0];
          currentSong.src = "/Web_Dev/Spotify_Clone/Songs/" + songs[index];
          index = songs.length;
        }
        currentSong.play();
      }
    }
    prevSong();
    // currentSong.play();
  });

  document.getElementById("nextSong").addEventListener("click", () => {
    async function nextSong() {
      let songs = await getSongs();
      let playing = currentSong.src.split("/Songs/")[1];

      for (let index = 0; index < songs.length; index++) {
        const element = songs[index];
        if (element == playing) {
          if (index == songs.length - 1) {
            index = 0;
          } else {
            index = index + 1;
          }
          document.getElementById("trackName").innerHTML =songs[index].split("$")[0].replaceAll("_"," ");
          document.getElementById("artistName").innerHTML =songs[index].split("$")[1].replaceAll("_"," ").split(".")[0];
          currentSong.src = "/Web_Dev/Spotify_Clone/Songs/" + songs[index];
          index = songs.length;
        }
        currentSong.play();
      }
    }
    nextSong();
    // currentSong.play();
  });
  
  document.querySelector(".seekBar").addEventListener("click",e =>{
    if(!e.target.classList.contains("circle")){
      let per =(e.offsetX)/(e.target.getBoundingClientRect().width)*100;
      document.querySelector(".circle").style.left = per + "%";
      currentSong.currentTime= ((currentSong.duration)*per)/100;
    }
    
  })
}


console.log(currentSong);

main();
