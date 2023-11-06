let isInvisible;
//Event listeners of the general buttons.
let listButton = document.querySelector("#list-box");
listButton.addEventListener("click", () => {
    //opens and closes the to-do list by click on the list button
    document.querySelector(".big-container").classList.remove("invisible");
});

let timerButton = document.querySelector("#timer-box");
timerButton.addEventListener("click", () => {
    //opens and closes the timer by click on the timer button
    document.querySelector(".little-container").classList.remove("invisible");
    if(!document.querySelector(".little-container").classList.contains("invisible")){
      isInvisible = false;
      saveBoxState();
    } else {
      isInvisible = true;
    }
});

let closeBtnTimer = document.querySelector(".close-timer");
closeBtnTimer.addEventListener("click", () => {
    //closes the timer on close button click
    document.querySelector(".little-container").classList.add("invisible");
    if(!document.querySelector(".little-container").classList.contains("invisible")){
      isInvisible = false;
      saveBoxState();
    } else {
      isInvisible = true;
    }
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

//------------list functions------------------------------------

const listElems = document.querySelectorAll('.checkNoDelete');
const EMPTY_SQUARE = '/images/check-square.svg';
const CHECKED_SQUARE = '/images/check-square-fill.svg';

//Add event listeners that add the check functionality
listElems.forEach((elem) => {
  //Iterate through the listElems array and add event listener to each element
  const checkIcon = elem.querySelector('.check');
  checkIcon.addEventListener('click', () => {
    // Toggle line-through for the text
    const textElement = elem.querySelector('.textie');
    textElement.classList.toggle('lined');
    // Toggle image source for the check icon
    const currentSrc = checkIcon.getAttribute('src');
    //check the source of the svg to change it on click
    if (currentSrc === EMPTY_SQUARE) {
        checkIcon.setAttribute('src', CHECKED_SQUARE);
      } else if (currentSrc === CHECKED_SQUARE) {
        checkIcon.setAttribute('src', EMPTY_SQUARE);
      }
      //save completion states of the tasks
      saveTaskState();
  });
});


//-----------------------Pomodoro timer functions and elements---------------------------

//pomodoro-timer buttons and elements
let timerOKBtn = document.getElementById("ok");
let timerStartBtn = document.getElementById("strt");
let breakBtn = document.getElementById("break");
let focusBtn = document.getElementById("focus");
let defaultBtn = document.getElementById("defTime");
let sessionText = document.getElementById("sessionNum");
let timerBox = document.getElementById("showTime");

//pomodoro-timer event listeners
timerOKBtn.addEventListener("click", newTime);
breakBtn.addEventListener("click", breakChange);
focusBtn.addEventListener("click", focusChange);
defaultBtn.addEventListener("click", toDefault);
timerStartBtn.addEventListener("click", startTimer);


//pomodoro-timer methods
let audio = new Audio("https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg")
let focusTime; 
let breakTime; 
let timerActive = false;
let isFocusTime = true; 
let timerInterval;
let sessionCount;
let timeValue;
let breakValue;

//Function to change the timer to the break time
function breakChange(){
    isFocusTime = false;
    newTime();
}

//Function to change the timer to the focus time
function focusChange(){
    isFocusTime = true;
    newTime();
}

//Function to get user break and focus time values 
function newTime() {
  let inputFocus = document.getElementById('pom-time');
  let inputBreak = document.getElementById('br-time');
  // turn the input values to integer
  let focusNew = parseInt(inputFocus.value, 10);
  let breakNew = parseInt(inputBreak.value, 10);

  timeValue = focusNew;
  breakValue = breakNew;

  //check that the times are no longer than 10 hours
  if(focusNew >= 600 || breakNew >= 600){
    window.alert('That is too many hours');
    return;
  }

  //check for faulty values
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

//reset the timer
function reset() {
    clearInterval(timerInterval);
    timerActive = false;

    //Update focusTime and breakTime values
    focusTime.hours = Math.floor(timeValue/60); focusTime.minutes = timeValue%60; focusTime.seconds = 0;
    breakTime.hours = Math.floor(breakValue/60); breakTime.minutes = breakValue%60; breakTime.seconds = 0;
 
    let timerFormat; 
    if(isFocusTime){timerFormat=focusTime} else {timerFormat=breakTime}; 

    let timerDisplay; 
    //Format the timers 
    if(timerFormat.hours > 0){
        timerDisplay = `${timerFormat.hours.toString().padStart(2, '0')}:${timerFormat.minutes.toString().padStart(2, '0')}:${timerFormat.seconds.toString().padStart(2, '0')}`
    } else {
       timerDisplay= `${timerFormat.minutes.toString().padStart(2, '0')}:${timerFormat.seconds.toString().padStart(2, '0')}`; 
    }

    timerBox.textContent = timerDisplay;
    saveTimer();
  }

  //Function to restore timer properties to default
  function toDefault(){
    let focusDefault = document.getElementById('pom-time').value;
    let breakDefault = document.getElementById('br-time').value;
    
    focusDefault = 25;
    breakDefault = 5;

    timeValue = focusDefault;
    breakValue = breakDefault;

    window.alert("A brand new timer")
    
    focusTime = {hours:0, minutes: 25, seconds:0};
    breakTime = {hours:0, minutes: 5, seconds:0};
    sessionCount = 0;
  
    sessionText.textContent= `Nº${sessionCount}`;
    reset();
  }

  //Function to start the timer countdown
  function startTimer() {
    //check if the timer is active
    if (!timerActive) {
      timerActive = true;
      let totalTime;

      if (isFocusTime) {
        totalTime = parseInt(focusTime.hours*3600 )+ parseInt(focusTime.minutes*60) + parseInt(focusTime.seconds) -1;
      } else {
        totalTime = parseInt(breakTime.hours*3600 )+ parseInt(breakTime.minutes*60) + parseInt(breakTime.seconds) -1;
      } 
      // set interval that updates every second
      timerInterval = setInterval(() => {
        if (totalTime <= 0) {
          audio.play();
          clearInterval(timerInterval);
          timerActive = false;
          //update session count if the session was a focus session
          if (isFocusTime) {
            sessionCount++;
            sessionText.textContent = `Nº${sessionCount}`;
          }
          reset();
        } else {
          //update the remaning seconds and timer display every second
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
  };
//--------------------Refresh and redirect handsling functions----------------------------
  
//Function to handle redirections to keep using the timer from its last state
  function handleRefresh() {
    
    const timer = JSON.parse(localStorage.getItem('pomodoro'));
  
    if (timer) {
      focusTime = timer.focusTime;
      breakTime = timer.breakTime;
      isFocusTime = timer.isFocusTime;
      sessionCount = timer.sessionCount || 0;
      timeValue = timer.timeValue || 25;
      breakValue = timer.breakValue || 5;
      
      //start the timer if it was active before the redirection
      if (timer.timerActive) {
        startTimer();
      }
    }
  }
 
  //Function to save timer properties to local storage
  function saveTimer() {
    const timer = {
      focusTime,
      breakTime,
      isFocusTime,
      sessionCount,
      timerActive,
      timeValue,
      breakValue
    };
  
    localStorage.setItem('pomodoro', JSON.stringify(timer));
  }

  //save the latest state of the properties before unload
  window.addEventListener('beforeunload', function () {
    saveBoxState();
    saveTimer();
  });

  //assign saved values upon loading
  window.addEventListener('load', function() {
    const timer = JSON.parse(localStorage.getItem('pomodoro'));
    focusTime = timer.focusTime;
    breakTime = timer.breakTime;
    sessionCount = timer.sessionCount;
    timeValue = timer.timeValue;
    breakValue = timer.breakValue;
    sessionText.textContent = `Nº${sessionCount}`;

    let timerFormat; 
    if(isFocusTime){timerFormat=focusTime} else {timerFormat=breakTime}; 
  //format timer display
    let timerDisplay; 
    if(timerFormat.hours > 0){
        timerDisplay = `${timerFormat.hours.toString().padStart(2, '0')}:${timerFormat.minutes.toString().padStart(2, '0')}:${timerFormat.seconds.toString().padStart(2, '0')}`
    } else {
       timerDisplay= `${timerFormat.minutes.toString().padStart(2, '0')}:${timerFormat.seconds.toString().padStart(2, '0')}`; 
    }

    timerBox.textContent = timerDisplay;
    document.getElementById('pom-time').value = timeValue;
    document.getElementById('br-time').value = breakValue;

    const state = JSON.parse(localStorage.getItem('boxState'));
    isInvisible = state.isInvisible;
    if(!isInvisible){
      document.querySelector(".little-container").classList.remove("invisible");
    }
    
    //Load the taskItem states every time the page loads
    loadTaskStates();
    });
 

  //save the visibility state of the timer box
  const saveBoxState = () => {
    const state = {
      isInvisible
    };
  
    localStorage.setItem("boxState", JSON.stringify(state));
  };

  //The function that loads the tasks' completion states from localStorage
function loadTaskStates(){
  const taskItemsState = JSON.parse(localStorage.getItem('taskItemsState')) || [];
  for (const elem of listElems) {
    const taskId = elem.querySelector('input[name="index"]').value;
    const taskItem = taskItemsState.find((item) => item.id === taskId);
    if (taskItem && taskItem.isCompleted) {
      const checkIcon = elem.querySelector('.check');
      const textElement = elem.querySelector('.textie');
      checkIcon.setAttribute('src', CHECKED_SQUARE);
      textElement.classList.add('lined');
    }
  }
};

// The function that saves the tasks' completion states to localStorage
function saveTaskState() {
  const taskItemsState = Array.from(listElems).map((elem) => ({
    id: elem.querySelector('input[name="index"]').value,
    isCompleted: elem.querySelector('.check').getAttribute('src') === CHECKED_SQUARE,
  }));
  localStorage.setItem('taskItemsState', JSON.stringify(taskItemsState));
};
 
//Handle information when refreshing the page
  handleRefresh();
  