console.log("Script Loaded");

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiU-q-eQmOazt3kzLzzfxjqLjwOYyVZ34",
  authDomain: "flip-clock-timer.firebaseapp.com",
  databaseURL: "https://flip-clock-timer-default-rtdb.firebaseio.com",
  projectId: "flip-clock-timer",
  storageBucket: "flip-clock-timer.appspot.com",
  messagingSenderId: "123043916705",
  appId: "1:123043916705:web:fa661b4cba492c0028f9e0"
};

// Initialize Firebase using compat library
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const modal = document.getElementById("admin-modal");
const openAdminButton = document.getElementById("open-admin");
const closeModalButton = document.getElementById("close-modal");
const startButton = document.getElementById("start-button");

const adminPasskey = "12345"; // Set your admin passkey

openAdminButton.addEventListener("click", () => {
  console.log("Admin Control button clicked!");
  modal.style.display = "flex";
});

closeModalButton.addEventListener("click", () => {
  console.log("Close button clicked!");
  modal.style.display = "none";
});

startButton.addEventListener("click", () => {
  const enteredPasskey = document.getElementById("admin-passkey").value;
  console.log("Start Button Clicked, Entered Passkey:", enteredPasskey);
  if (enteredPasskey === adminPasskey) {
    const startTime = Date.now();
    database.ref("timer").set({
      startTime: startTime,
      running: true
    });
    modal.style.display = "none";
  } else {
    alert("Incorrect Passkey");
  }
});

// Function to update the flip clock digits
const updateClock = (hours, minutes, seconds) => {
  hoursTop.textContent = hoursBottom.textContent = formatTime(hours);
  minutesTop.textContent = minutesBottom.textContent = formatTime(minutes);
  secondsTop.textContent = secondsBottom.textContent = formatTime(seconds);
};

// Function to format time with two digits
const formatTime = (time) => (time < 10 ? "0" + time : time);

// Real-time synchronization logic
let intervalId;
database.ref("timer").on("value", (snapshot) => {
  const data = snapshot.val();
  if (data && data.running) {
    const startTime = data.startTime;

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;
      updateClock(hours, minutes, seconds);
    }, 1000);
  } else {
    if (intervalId) clearInterval(intervalId);
    updateClock(0, 0, 0);
  }
});
