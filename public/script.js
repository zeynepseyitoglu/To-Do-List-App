//Event listeners of the general buttons.
let listButton = document.querySelector("#list-box");
listButton.addEventListener("click", () => {
    //opens and closes the to-do list by click on the list button
    document.querySelector(".big-container").classList.toggle("invisible");
});

let timerButton = document.querySelector("#timer-box");
timerButton.addEventListener("click", () => {
    //opens and closes the timer by click on the timer button
    document.querySelector(".little-container").classList.toggle("invisible");
});

let closeBtnTimer = document.querySelector(".close-timer");
closeBtnTimer.addEventListener("click", () => {
    //closes the timer on close button click
    document.querySelector(".little-container").classList.add("invisible");
});

let closeBtnList = document.querySelector(".close-list");
closeBtnList.addEventListener("click", () => {
    //closes the to-do list on close button click
    document.querySelector(".big-container").classList.add("invisible");
});

let settingButton = document.querySelector(".settings");
settingButton.addEventListener("click", () => {
    //opens and closes the timer settings when clicked
    document.querySelector(".timer-settings-box").classList.toggle("invisible");
})

const listElems = document.querySelectorAll('.checkNoDelete');
const EMPTY_SQUARE = '/images/check-square.svg';
const CHECKED_SQUARE = '/images/check-square-fill.svg';


listElems.forEach((elem) => {
  const checkIcon = elem.querySelector('.check');
  checkIcon.addEventListener('click', () => {
    // Toggle line-through for the text
    const textElement = elem.querySelector('.textie');
    textElement.classList.toggle('lined');

    // Toggle image source for the check icon
    //const checkIcon = elem.querySelector('.check');
    const currentSrc = checkIcon.getAttribute('src');
    if (currentSrc === EMPTY_SQUARE) {
        checkIcon.setAttribute('src', CHECKED_SQUARE);
      } else if (currentSrc === CHECKED_SQUARE) {
        checkIcon.setAttribute('src', EMPTY_SQUARE);
      }
  });
});



//pomodoro-timer event listeners
let timerOKBtn = document.getElementById("ok");
let timerStartBtn = document.getElementById("strt");
let breakBtn = document.getElementById("break");
let focusBtn = document.getElementById("focus");
let defaultBtn = document.getElementById("defTime");
let sessionText = document.getElementById("sessionNum");

timerOKBtn.addEventListener("click", newTime);
breakBtn.addEventListener("click", breakChange);
focusBtn.addEventListener("click", focusChange);
defaultBtn.addEventListener("click", toDefault);
timerStartBtn.addEventListener("click", startTimer);


//pomodoro-timer methods
let audio = new Audio("https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg")
let focusTime; 
let breakTime; 
let timerBox = document.getElementById("showTime");
let timerActive = false;
let isFocusTime = true; 
let timerInterval;
let sessionCount;

function breakChange(){
    isFocusTime = false;
    newTime();
}

function focusChange(){
    isFocusTime = true;
    newTime();
}

function newTime() {
  let inputFocus = document.getElementById('pom-time');
  let inputBreak = document.getElementById('br-time');

  // turn the input values to integer
  let focusNew = parseInt(inputFocus.value, 10);
  let breakNew = parseInt(inputBreak.value, 10);

  if (isNaN(focusNew) || isNaN(breakNew) || focusNew <= 0 || breakNew <= 0) {
    window.alert('Work and break times must be positive numbers');
    return;  
  }

  focusTime = {
    hours: Math.floor(focusNew/ 60),
    minutes: focusNew % 60,
    seconds: 0,
  }
  breakTime = {
    hours: Math.floor(breakNew/ 60),
    minutes: breakNew % 60,
    seconds: 0,
  };
  reset();
}

function reset() {
    clearInterval(timerInterval);
    timerActive = false;
 
    let timerFormat; 
    if(isFocusTime){timerFormat=focusTime} else {timerFormat=breakTime}; 

    let timerDisplay; 
    if(timerFormat.hours > 0){
        timerDisplay = `${timerFormat.hours.toString().padStart(2, '0')}:${timerFormat.minutes.toString().padStart(2, '0')}:${timerFormat.seconds.toString().padStart(2, '0')}`
    } else {
       timerDisplay= `${timerFormat.minutes.toString().padStart(2, '0')}:${timerFormat.seconds.toString().padStart(2, '0')}`; 
    }

    timerBox.textContent = timerDisplay;
    saveTimerStateToLocalStorage();
  }

  function toDefault(){
    window.alert("A brand new timer")
    document.getElementById('pom-time').value = 25;
    document.getElementById('br-time').value = 5;
    focusTime = {hours:0, minutes: 25, seconds:0};
    breakTime = {hours:0, minutes: 5, seconds:0};
    sessionCount = 0;
    sessionText.textContent= `Nº${sessionCount}`;
    reset();
  }

  function startTimer() {
    if (!timerActive) {
      timerActive = true;
      let totalTime;

      if (isFocusTime) {
        totalTime = parseInt(focusTime.hours*3600 )+ parseInt(focusTime.minutes*60) + parseInt(focusTime.seconds) - 1;
      } else {
        totalTime = parseInt(breakTime.hours*3600 )+ parseInt(breakTime.minutes*60) + parseInt(breakTime.seconds) - 1;
      } 
      // set interval that updates every second
      timerInterval = setInterval(() => {
        if (totalTime <= 0) {
          audio.play();
          clearInterval(timerInterval);
          timerActive = false;
          if (isFocusTime) {
            sessionCount++;
            sessionText.textContent = `Nº${sessionCount}`;
           newTime();
          }
        } else {
          
          let hours = Math.floor(totalTime / 3600);
          let minutes = Math.floor((totalTime % 3600) / 60);
          let seconds = totalTime % 60;
          let timerDisplay;
          if(hours > 0)
          {timerDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;}
          else {timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;}
          timerBox.textContent = timerDisplay;
          totalTime --;

          if(isFocusTime){
            focusTime.hours = hours;
            focusTime.minutes = minutes;
            focusTime.seconds = seconds;
          } else {
            breakTime.hours = hours;
            breakTime.minutes = minutes;
            breakTime.seconds = seconds;
          }
          // Save the timers every second
          saveTimer();
        }
      }, 1000);
    }
  }

  function handleRefresh() {
    
    const timer = JSON.parse(localStorage.getItem('pomodoro'));
  
    if (timer) {
      focusTime = timer.focusTime;
      breakTime = timer.breakTime;
      isFocusTime = timer.isFocusTime;
      sessionCount = timer.sessionCount;
  
      if (timer.timerActive) {
        startTimer();
      }
    }
  }
 
  function saveTimer() {
    const timer = {
      focusTime,
      breakTime,
      isFocusTime,
      sessionCount,
      timerActive
    };
  
    localStorage.setItem('pomodoro', JSON.stringify(timer));
  }

  window.addEventListener('beforeunload', function () {
    saveTimer();
  });

  window.addEventListener('load', function() {
    const timer = JSON.parse(localStorage.getItem('pomodoro'));
    focusTime = timer.focusTime;
    breakTime = timer.breakTime;
    sessionCount = timer.sessionCount;

    sessionText.textContent = `Nº${sessionCount}`;

    let timerFormat; 
    if(isFocusTime){timerFormat=focusTime} else {timerFormat=breakTime}; 
  
    let timerDisplay; 
    if(timerFormat.hours > 0){
        timerDisplay = `${timerFormat.hours.toString().padStart(2, '0')}:${timerFormat.minutes.toString().padStart(2, '0')}:${timerFormat.seconds.toString().padStart(2, '0')}`
    } else {
       timerDisplay= `${timerFormat.minutes.toString().padStart(2, '0')}:${timerFormat.seconds.toString().padStart(2, '0')}`; 
    }

    timerBox.textContent = timerDisplay;


  });
  
  handleRefresh();