const socket = io();

let timerInterval;
let startTime;

document.getElementById('startButton').addEventListener('click', () => {
    startTimer();
});

function startTimer() {
    startTime = Date.now();
    socket.emit('startTimer', startTime);
}

socket.on('syncTimer', (startTime) => {
    if (timerInterval) clearInterval(timerInterval);
    startTimerDisplay(startTime);
});

function startTimerDisplay(startTime) {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');

        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }, 1000);
}
