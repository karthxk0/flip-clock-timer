console.log("Script Loaded");

// Firebase configuration (replace with your Firebase project's config)
const firebaseConfig = {
  apiKey: "AIzaSyBiU-q-eQmOazt3kzLzzfxjqLjwOYyVZ34",
  authDomain: "flip-clock-timer.firebaseapp.com",
  databaseURL: "https://flip-clock-timer-default-rtdb.firebaseio.com",
  projectId: "flip-clock-timer",
  storageBucket: "flip-clock-timer.appspot.com",
  messagingSenderId: "123043916705",
  appId: "1:123043916705:web:fa661b4cba492c0028f9e0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get references to clock elements
const hoursTop = document.querySelector(".hours-top");
const minutesTop = document.querySelector(".minutes-top");
const secondsTop = document.querySelector(".seconds-top");

// Admin modal elements
const adminButton = document.getElementById("open-admin");
const adminModal = document.getElementById("admin-modal");
const closeModal = document.getElementById("close-modal");
const submitPasskey = document.getElementById("submit-passkey");
const adminPasskey = document.getElementById("admin-passkey");
const timerSettings = document.getElementById("timer-settings");

// Timer setting elements
const setHours = document.getElementById("set-hours");
const setMinutes = document.getElementById("set-minutes");
const setSeconds = document.getElementById("set-seconds");
const startTimerButton = document.getElementById("start-timer");

// Event to open admin control modal
adminButton.addEventListener("click", () => {
    adminModal.style.display = "block";
});

// Event to close modal
closeModal.addEventListener("click", () => {
    adminModal.style.display = "none";
});

// Submit admin passkey
submitPasskey.addEventListener("click", () => {
    const enteredPasskey = adminPasskey.value;
    if (enteredPasskey === "12345") {
        timerSettings.style.display = "block";
    } else {
        alert("Incorrect passkey!");
    }
});

// Start timer button
startTimerButton.addEventListener("click", () => {
    const hours = parseInt(setHours.value) || 0;
    const minutes = parseInt(setMinutes.value) || 0;
    const seconds = parseInt(setSeconds.value) || 0;

    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    database.ref("timer").set({
        running: true,
        startTime: Date.now(),
        duration: totalMilliseconds
    });

    adminModal.style.display = "none";
});

// Function to update the clock display
function updateClock(startTime, duration) {
    const now = Date.now();
    const elapsedTime = now - startTime;
    const remainingTime = duration - elapsedTime;

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    hoursTop.textContent = String(hours).padStart(2, '0');
    minutesTop.textContent = String(minutes).padStart(2, '0');
    secondsTop.textContent = String(seconds).padStart(2, '0');
}

// Listen for changes to the timer in Firebase
database.ref("timer").on("value", (snapshot) => {
    const timerData = snapshot.val();
    if (timerData && timerData.running) {
        const intervalId = setInterval(() => {
            updateClock(timerData.startTime, timerData.duration);
        }, 1000);
    }
});
