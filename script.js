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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const flipClock = document.getElementById("flip-clock");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const startButton = document.getElementById("start-button");

const adminPasskey = "12345"; // Set your admin passkey

// Helper function to format time
const formatTime = (time) => (time < 10 ? "0" + time : time);

// Function to update the clock
const updateClock = (hours, minutes, seconds) => {
  hoursEl.textContent = formatTime(hours);
  minutesEl.textContent = formatTime(minutes);
  secondsEl.textContent = formatTime(seconds);
};

// Check if admin passkey is entered
startButton.addEventListener("click", () => {
  const enteredPasskey = document.getElementById("admin-passkey").value;
  if (enteredPasskey === adminPasskey) {
    const startTime = Date.now();

    // Save the start time to the Firebase database
    database.ref("timer").set({
      startTime: startTime,
      running: true
    });
  } else {
    alert("Incorrect Passkey");
  }
});

// Realtime Listener to sync timer across all clients
database.ref("timer").on("value", (snapshot) => {
  const data = snapshot.val();
  if (data && data.running) {
    const startTime = data.startTime;
    setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(elapsedTime / 3600);
      const minutes = Math.floor((elapsedTime % 3600) / 60);
      const seconds = elapsedTime % 60;

      updateClock(hours, minutes, seconds);
    }, 1000);
  }
});
