// Buttons event listener
const pomodoroTimer = document.querySelector('#pomodoro-timer')
const startButton = document.querySelector('#pomodoro-start')
const pauseButton = document.querySelector('#pomodoro-pause')
const stopButton = document.querySelector('#pomodoro-stop')

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

// Variables
let isClockRunning = false
let workSession = 1500 // 25 minutes in seconds
let timeLeft = 1500
let breakSession = 1500 //5 minutes in seconds
let type = 'Work'
let timeSpent = 0


const toggleClock = (reset) => {
    if (reset) {
        // stop timer
        stopClock()

    }else {
        if (isClockRunning === true) {
            clockTimer = setInterval(() => {
                // decrese time left and increase time spent
                stepDown() 
                displayTimeLeft()
            }, 1000)
            clearInterval(clockTimer)
            // pause timer
            isClockRunning = false
        } else {
            //start timer
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
    clearInterval(clockTimer) // reset timer set
    isClockRunning = false // update variable to know timer has stopped
    timeLeft = workSession // reset the time left to original state
    displayTimeLeft() // update timer display
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
        } else {
            timeLeft = workSession
            type = 'Work'
            displaySessionLog('Break')
        }
    }
    displayTimeLeft()
}