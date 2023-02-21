
const pomodoroTimer = document.querySelector('#pomodoro-timer')
const startButton = document.querySelector('#pomodoro-start')
const pauseButton = document.querySelector('#pomodoro-pause')
const stopButton = document.querySelector('#pomodoro-stop')

// Event listeners

// Start button
startButton.addEventListener('click', () => {
  toggleClock()
})

// Pause button
pauseButton.addEventListener('click', () => {
  toggleClock()
})

// Stop button
stopButton.addEventListener('click', () => {
  toggleClock(true)
})

//update work time
workDuration.addEventListener('input', () =>{
    updateWorkDuration = minutesToSeconds(workDuration.value)
})


// update break time 
breakDuration.addEventListener('input', () => {
    updateBreakDuration = minutesToSeconds(breakDuration.value)
})

// Variables
let isClockRunning = false
let workSession = 1500 // 25 minutes in seconds
let timeLeft = 1500
let breakSession = 1500 //5 minutes in seconds
let type = 'Work'
let timeSpent = 0
let taskLabel = document.getElementById('pomo-task')
let updateWorkDuration
let updateBreakDuration
let workDuration = document.getElementById('work-duration')
let breakDuration = document.getElementById('break-duration')

workDuration.value = '25'
breakDuration = '5'

let isTimerStopped = true



const toggleClock = (reset) => {
    if (reset) {
        // stop timer
        stopClock()
    }else {
        if(isTimerStopped) {
            setUpdateTimer()
            isTimerStopped = false
        }
        if (isClockRunning === true) { 
             // pause timer
            clearInterval(clockTimer)
            isClockRunning = false
        } else {
            //start timer
            clockTimer = setInterval(() => {
            stepDown() 
                displayTimeLeft()
            }, 1000)  
            isClockRunning = true  
        }
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
pomodoroTimer.innerText = result.toString()
}


const stopClock = () => {
    displaySessionLog(type) // display time spent so in this session
    clearInterval(clockTimer) // reset timer set
    isClockRunning = false // update variable to know timer has stopped
    timeLeft = workSession // reset the time left to original state
    displayTimeLeft() // update timer display
    timeSpent = 0 // increases time we spend in session
    type = type === 'Work' ? 'Break' : 'Work' // toggle between work and break
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
            if(isTimerStopped){
                setUpdateTimer()
                isTimerStopped = false
            }
            taskLabel.value = 'Break'
            taskLabel.disabled = true
        } else {
            timeLeft = workSession
            type = 'Work'
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
        sessionLabel = sessionLabel
    }else ~{
        sessionLabel : 'Break'
    }
    let elapsedTime = parseInt(timeSpent / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1'

    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`)
    li.appendChild(text)
    sessionList.appendChild(li)
 
}

// converts minutes to seconds from input
const minutesToSeconds = (mins) => {
    return mins = 60
}

//set new time input by user 
const setUpdateTimer = () => {
    if(type === 'Work') {
        timeLeft = updateWorkDuration ? updateWorkDuration : workSession
        workSession = timeLeft
    }else {
        timeLeft = updateBreakDuration ? updateBreakDuration : breakDuration
        breakDuration = timeLeft
    }
}