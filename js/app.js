let mainTitle = "The Stack Of Wheat";
let mainAuthor = "John O'Brien";

let tracks = [
  {
    url: '../audio/GuitarTest.mp3',
    img: 'https://blog.mcneelamusic.com/wp-content/uploads/2020/09/Tin-Whistle.png',
    title: "Tin Whistle",
    author: "John O'Brien"
  },
  {
    url: '../audio/BodhranTest.mp3',
    img: 'https://blog.mcneelamusic.com/wp-content/uploads/2020/09/Bodhran.png',
    title: "Bouzouki",
    author: "John O'Brien"
  },
  {
    url: '../audio/BouzTest.mp3',
    img: 'https://blog.mcneelamusic.com/wp-content/uploads/2020/09/Bouzouki.png',
    title: "Bodhra",
    author: "John O'Brien"
  },
  {
    url: '../audio/PianoTest.mp3',
    img: 'https://blog.mcneelamusic.com/wp-content/uploads/2020/09/Low-Whistle.png',
    title: "Low Whistle",
    author: "John O'Brien"
  }
];

let players = [];

let progress = 0;
let duration = 0;
let volume = 80;
let speed = 100;
let isPlaying = false;
let isLoopEnabled = false;
let isAllMuted = false;
let progressInterval;

const loadAudioFiles = () => {
  tracks.forEach(track => {
    let audio = new Audio();
    audio.src = track.url;
    audio.volume = 0.8;
    audio.controls = false;
    audio.autoplay = false;
    audio.addEventListener('loadeddata', () => {
      if (audio.readyState >= 2) {
        duration = audio.duration;
        parseDuration();
      }
    });
    audio.addEventListener('ended', () => {
      if (!isLoopEnabled) {
        audio.pause();
        audio.currentTime = 0;
        progress = 0;
        isPlaying = false;
        document.getElementById("toggle-play").classList.remove('active');
      }
    });
    players.push(audio);
  });
  document.querySelectorAll("#song-info h1, #song-info-hud h1").forEach(i => i.innerHTML = mainTitle);
  document.querySelectorAll("#song-info h4, #song-info-hud h4").forEach(i => i.innerHTML = mainAuthor);
  tracks.forEach((track, i) => {
    createTrackItem(track, i);
  });
  tracks.forEach((track, i) => {
    assignMuteButtons(i);
  });
}

const playPauseAll = () => {
  if (checkIfPlayable) {
    players.forEach(player => {
      if (isPlaying)
        player.pause();
      else
        player.play();
    });
    progressInterval = setInterval(() => {
      progress = players[0].currentTime;
      parseProgress();
    }, 100);
    isPlaying = !isPlaying;
  } else {
    document.getElementById("toggle-play").classList.remove('active');
    alert("Please wait for all the tracks to be loaded");
  }
}

const muteAll = () => {
  players.forEach(player => {
    if (isAllMuted)
      player.muted = false;
    else
      player.muted = true;
  });
  isAllMuted = !isAllMuted;
}

const toggleLoop = () => {
  players.forEach(player => {
    if (isLoopEnabled)
      player.loop = false;
    else
      player.loop = true;
  });
  isLoopEnabled = !isLoopEnabled;
}

const changeVolume = () => {
  volume = parseInt(document.getElementById("volume-range").value);
  players.forEach(player => {
    player.volume = volume / 100;
  });
}

const changeSpeed = () => {
  speed = parseInt(document.getElementById("speed-range").value);
  players.forEach(player => {
    player.playbackRate = speed / 100;
  });
}

const restoreSpeed = () => {
  players.forEach(player => {
    player.playbackRate = 1;
  });
  document.getElementById("speed-range").value = 100;
}

const checkIfPlayable = () => {
  players.forEach(player => {
    if (player.readyState >= 2) return false;
  });
  return true;
}

const parseDuration = () => {
  let min, sec, out;
  if (duration > 59) {
    min = Math.round(duration / 60);
    sec = Math.round(duration % 60);
  } else {
    min = 0;
    sec = Math.round(duration);
  }
  out = twoDigits(min) + ":" + twoDigits(sec);
  document.getElementById("duration-string").innerHTML = out;
  document.getElementById("progress-range").setAttribute('max', Math.round(duration));
}

const parseProgress = () => {
  let min, sec, out;
  if (progress > 59) {
    min = Math.round(progress / 60);
    sec = Math.round(progress % 60);
  } else {
    min = 0;
    sec = Math.round(progress);
  }
  out = twoDigits(min) + ":" + twoDigits(sec);
  document.getElementById("progress-string").innerHTML = out;
  document.getElementById("progress-range").value = Math.round(progress);
}

const scrubProgress = () => {
  progress = document.getElementById("progress-range").value;
  players.forEach(player => {
    player.currentTime = progress;
  });
  parseProgress();
}

const twoDigits = n => {
  return (n < 10 ? '0' : '') + n;
}

const cleanup = () => {
  clearInterval(progressInterval);
  players.forEach(player => {
    player.pause();
    delete player;
  })
  delete players;
  delete tracks;
  delete progress;
  delete duration;
  delete volume;
  delete speed;
  delete isPlaying;
  delete isLoopEnabled;
  delete isAllMuted;
  delete progressInterval;
}

const createTrackItem = (track, i) => {
  let out = `
    <div class="col">
      <div class="track">
        <div class="track-img">
          <img src="${track.img}">
        </div>
        <div class="track-info">
          <h3>${track.title}</h3>
          <h4>${track.author}</h4>
        </div>
        <div class="track-mute">
          <button id="toggle-volume-${i}" type="button" class="btn btn-link btn-lg" data-bs-toggle="button" title="Mute track">
            <i class="fas fa-volume-up"></i>
            <i class="fas fa-volume-mute"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  let tracklist = document.getElementById('tracklist');
  tracklist.innerHTML = tracklist.innerHTML + out;
}

const assignMuteButtons = i => {
  document.getElementById(`toggle-volume-${i}`).addEventListener('click', () => {
      players[i].muted = !players[i].muted;
    }
  );
}

window.addEventListener('load', loadAudioFiles);
window.addEventListener('unload', cleanup);
document.getElementById("toggle-play").addEventListener('click', playPauseAll);
document.getElementById("toggle-loop").addEventListener('click', toggleLoop);
document.getElementById("toggle-volume").addEventListener('click', muteAll);
document.getElementById("reset-speed").addEventListener('click', restoreSpeed);
document.getElementById("volume-range").addEventListener('input', changeVolume);
document.getElementById("speed-range").addEventListener('input', changeSpeed);
document.getElementById("progress-range").addEventListener('input', scrubProgress);