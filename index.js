window.addEventListener("load", initAll, false);
function initAll(){
  var video = document.querySelector("#theVideo");
  var progressbar = document.querySelector("#progressbar"),
      playedbar = document.querySelector("#playedbar"),
      togglePlay = document.querySelector("#togglePlay"),
      videoForm = document.querySelector("#videoForm"),
      videoUrl = document.querySelector("#videoUrl"),
      videoList = document.getElementById("videoList"); 

  ajax("api.php", function(data) {
    var videos = JSON.parse(data);
    if (Array.isArray(videos) && videos.length > 0){
      videoList.innerHTML = "";
      videos.forEach(function(currentVideo){
	addVideoItem(currentVideo);
      });
    }
  });

  videoList.addEventListener("click", videoListClickHandler, false);
  function videoListClickHandler(event){
    var target = event.target;
    if (target.tagName.toLowerCase() === "li") {
      if (target.className !== "currentVideo") {
	var prevVideo = document.querySelector(".currentVideo");
	prevVideo && (prevVideo.className = "");
	target.className = "currentVideo";
	loadVideo(target.innerText);
      }
    }
  }
  function loadVideo(fileName) {
    ajax("api.php?q=loadVideo&file=" + encodeURIComponent(fileName), function(data){
      video.src = data;
      video.play();
    });
  }

  videoForm.addEventListener("submit", videoFormSubmitHandler, false); 
  function videoFormSubmitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    video.src = videoUrl.value;
    video.play();
  }

  progressbar.addEventListener("click", seekVideoHandler, false);
  function seekVideoHandler(event) {
    var x = event.offsetX, length = parseInt(window.getComputedStyle(progressbar).width);
    var percentage = x / length * 100 + "%";
    var seekToTime = x / length * video.duration;
    console.log("seek to ", percentage);
    video.currentTime = seekToTime;
  }
  progressbar.addEventListener("mousemove", mousemoveHandler, false);
  function mousemoveHandler(event){
    console.log("mouse move");
    var x = event.offsetX, length = parseInt(window.getComputedStyle(progressbar).width);
    var title = formatTime(video.duration * (x / length));
    progressbar.title = title;
  }

  video.addEventListener("timeupdate", timeupdateHandler, false);
  function timeupdateHandler(){
    var percentage = video.currentTime / video.duration * 100 + "%"; 
    playedbar.style.width = percentage;

  }
}

function formatTime(seconds) {
  seconds = parseInt(seconds);
  var ms = seconds % 3600;
  var hs = (seconds - ms) / 3600; // Hours
  var ss = ms % 60; // Seconds
  var minutes = (ms - ss) / 60; // Minutes
  return (hs > 0 ? (hs + ":") : "") + (minutes > 9 ? minutes : "0" + minutes) + ":" + (ss > 9 ? ss : "0" + ss);
}

function ajax(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      callback(xmlhttp.responseText);
    }
  };
  xmlhttp.send();
}
function addVideoItem(currentVideo) {
  var videoList = document.getElementById("videoList"); 
  var li = document.createElement("li");
  li.innerHTML = currentVideo;
  videoList.appendChild(li);
}