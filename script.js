// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiU-q-eQmOazt3kzLzzfxjqLjwOYyVZ34,
    authDomain: "flip-clock-timer.firebaseapp.com",
    databaseURL: "https://flip-clock-timer-default-rtdb.firebaseio.com",
    projectId: "flip-clock-timer",
    storageBucket: "flip-clock-timer.appspot.com",
    messagingSenderId: "123043916705",
    appId: "1:123043916705:web:fa661b4cba492c0028f9e0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let timerInterval;
let startTime;

document.getElementById('startButton').addEventListener('click', () => {
    startTimer();
});

function startTimer() {
    startTime = Date.now();
    database.ref('timer').set({ startTime: startTime });
}

database.ref('timer').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.startTime) {
        if (timerInterval) clearInterval(timerInterval);
        startTimerDisplay(data.startTime);
    }
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
