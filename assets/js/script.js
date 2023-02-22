document.addEventListener("DOMContentLoaded", () => {

const startButton = document.getElementById('start-pomo')
const stopButton = document.getElementById('stop-pomo')

// Variables
let isTimerRunning = false
let workSession = 1500 // 25 minutes in seconds
let timeLeft = 1500
let breakSession = 300 //5 minutes in seconds
let timeSpent = 0
let type = 'Work'
let taskLabel = document.getElementById('pomo-task')
let updateWorkDuration
let updateBreakDuration
let workDuration = document.getElementById('work-input')
let breakDuration = document.getElementById('break-input')

workDuration.value = '25'
breakDuration.value = '5'

let isTimerStopped = true

const progressBar = new ProgressBar.Circle("#pomo-timer", {
    strokeWidth: 2,
    text: {
      value: "25:00"
    },
    trailColor: "#194a7a",
  });


// Button Event listeners

// Start button
startButton.addEventListener('click', () => {
  toggleClock()
})

// Stop button
stopButton.addEventListener('click', () => {
  toggleClock(true)
})

//update work time
workDuration.addEventListener('input', () =>{
    updateWorkDuration = minuteToSeconds(workDuration.value)
})


// update break time 
breakDuration.addEventListener('input', () => {
    updateBreakDuration = minuteToSeconds(breakDuration.value)
})


// converts minutes to seconds from input
const minuteToSeconds = (mins) => {
    return mins * 60
}


const toggleClock = (reset) => {
    togglePlayPauseIcon(reset) 
    // stop timer
    if (reset) {
        stopClock()
    }else {
        if(isTimerStopped) {
            setUpdateTimer()
            isTimerStopped = false
        }
        if (isTimerRunning === true) { 
             // pause timer
            clearInterval(clockTimer)
            isTimerRunning = false
        } else {
            //start timer
            clockTimer = setInterval(() => {
            stepDown() 
                displayTimeLeft()
                progressBar.set(calculateSessionProgress())
            }, 1000)  
            isTimerRunning = true  
        }
        showStopIcon()
    }
}


const displayTimeLeft = () => {
    const secondsLeft = timeLeft
    let result = ''
    const seconds = secondsLeft % 60
    const minutes = parseInt(secondsLeft / 60) % 60
    let hours = parseInt(secondsLeft / 3600) 
// add zeroes if the number is less than 10
    function addZeroes(time) {
    return time < 10 ? `0${time}` : time
    }
    if (hours > 0) result += `${hours}:`
    result += `${addZeroes(minutes)}:${addZeroes(seconds)}`
    progressBar.text.innerText = result.toString()
}


const stopClock = () => {
    setUpdateTimer()
    displaySessionLog(type) // display time spent so in this session
    clearInterval(clockTimer) // reset timer set
    isTimerStopped = true // knows when the timer starts from the first time and starts again after it has been stop
    isTimerRunning = false // update variable to know timer has stopped
    timeLeft = workSession // reset the time left to original state
    displayTimeLeft() // update timer display
    type = type === 'Work' ? 'Break' : 'Work' // toggle between work and break 
    timeSpent = 0 // increases time we spend in session
}


// toggle between 'work' and 'break' when timer runs out
const stepDown = () => {
    if (timeLeft > 0) {
        timeLeft--
        timeSpent++
    } else if (timeLeft === 0) {
        timeSpent = 0 
        //if timer is over switch from work to break and viceversa
        if(type === 'Work') {
            timeLeft = breakSession
            displaySessionLog('Work')
            type = 'Break'
            setUpdateTimer()
            if(isTimerStopped){
                setUpdateTimer()
                isTimerStopped = false
            }
            taskLabel.value = 'Break'
            taskLabel.disabled = true
        } else {
            timeLeft = workSession
            type = 'Work'
            setUpdateTimer()
            if(isTimerStopped){
                setUpdateTimer()
                isTimerStopped = false
            }
            if(taskLabel.value === 'Break') {
                taskLabel.value = SessionLabel
            }
            taskLabel.disabled = false
            displaySessionLog('Break')
        }
    }
    displayTimeLeft()
}

// display session log
const displaySessionLog = (type) => {
    const sessionList = document.getElementById('pomo-sessions')
    // append li to ul
    const li = document.createElement('li')
    if (type === 'Work') {
        sessionLabel = taskLabel.value ? taskLabel.value : 'Work'
        workSessionLabel = sessionLabel
    }else {
        sessionLabel : 'Break'
    }
    let elapsedTime = parseInt(timeSpent / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1'

    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`)
    li.appendChild(text)
    sessionList.appendChild(li)
 
}



//set new time input by user 
const setUpdateTimer = () => {
    if(type === 'Work') {
        timeLeft = updateWorkDuration ? updateWorkDuration : workSession;
        workSession = timeLeft
    }else {
        timeLeft = updateBreakDuration ? updateBreakDuration : breakDuration;
        breakDuration = timeLeft
    }
}

// Hide pause button when timer is not working
const togglePlayPauseIcon = (reset) => {
    const playIcon = document.getElementById('play-icon')
    const pauseIcon = document.getElementById('pause-icon')
    if(reset) {
        // when timer is reset always revert to play icon
        if(playIcon.classList.contains('hidden')) {
            playIcon.classList.remove('hidden')
        }
        if(!pauseIcon.classList.contains('hidden')) {
            pauseIcon.classList.add('hidden')
        }
    } else {
        playIcon.classList.toggle('hidden')
        pauseIcon.classList.toggle('hidden')
    }
}


// shows stop button when timer is start
const showStopIcon = () => {
    const stopButton = document.getElementById('stop-pomo')
    stopButton.classList.remove('hidden')
}

const calculateSessionProgress = () => {
    const sessionDuration = type === 'Work' ? workDuration : breakDuration 
    return(timeSpent / sessionDuration) * 10
}

});

