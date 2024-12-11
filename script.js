console.log("Script Loaded");

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Clock elements
const hoursTop = document.querySelector(".hours-top");
const minutesTop = document.querySelector(".minutes-top");
const secondsTop = document.querySelector(".seconds-top");
const hoursBottom = document.querySelector(".hours-bottom");
const minutesBottom = document.querySelector(".minutes-bottom");
const secondsBottom = document.querySelector(".seconds-bottom");

// Admin button and modal elements
const adminButton = document.getElementById("open-admin");
const adminModal = document.getElementById("admin-modal");
const closeModal = document.getElementById("close-modal");
const submitPasskey = document.getElementById("submit-passkey");
const adminPasskey = document.getElementById("admin-passkey");
const timerSettings = document.getElementById("timer-settings");

// Timer settings elements
const setHours = document.getElementById("set-hours");
const setMinutes = document.getElementById("set-minutes");
const setSeconds = document.getElementById("set-seconds");
const startTimerButton = document.getElementById("start-timer");

// Admin button actions
adminButton.addEventListener("click", () => adminModal.style.display = "block");
closeModal.addEventListener("click", () => adminModal.style.display = "none");

submitPasskey.addEventListener("click", () => {
    const adminPasskey = process.env.REACT_APP_ADMIN_PASSKEY;
    if (adminPasskey && adminPasskey === adminPasskeyInput.value) {
        timerSettings.style.display = "block";
    } else {
        alert("Incorrect passkey!");
    }
});

// Start timer
startTimerButton.addEventListener("click", () => {
    const hours = parseInt(setHours.value) || 0;
    const minutes = parseInt(setMinutes.value) || 0;
    const seconds = parseInt(setSeconds.value) || 0;
    const duration = (hours * 3600 + minutes * 60 + seconds) * 1000;
    database.ref("timer").set({
        running: true,
        startTime: Date.now(),
        duration: duration
    });
    adminModal.style.display = "none";
});

// Flip effect and timer update
function updateClock(startTime, duration) {
    const now = Date.now();
    const remainingTime = duration - (now - startTime);
    if (remainingTime < 0) {
        clearInterval(timerInterval);
        return;
    }

    const hours = Math.floor(remainingTime / 3600000);
    const minutes = Math.floor((remainingTime % 3600000) / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    flipUpdate(hoursTop, hoursBottom, String(hours).padStart(2, '0'));
    flipUpdate(minutesTop, minutesBottom, String(minutes).padStart(2, '0'));
    flipUpdate(secondsTop, secondsBottom, String(seconds).padStart(2, '0'));
}

// Flip card animation
function flipUpdate(topElement, bottomElement, newValue) {
    if (topElement.textContent !== newValue) {
        bottomElement.textContent = newValue;
        topElement.parentElement.style.transform = 'rotateX(-180deg)';
        setTimeout(() => {
            topElement.textContent = newValue;
            topElement.parentElement.style.transform = 'rotateX(0deg)';
        }, 300);
    }
}

// Firebase listener to sync timer across clients
let timerInterval;
database.ref("timer").on("value", (snapshot) => {
    const timerData = snapshot.val();
    if (timerData && timerData.running) {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => updateClock(timerData.startTime, timerData.duration), 1000);
    }
});
