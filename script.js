// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiU-q-eQmOazt3kzLzzfxjqLjwOYyVZ34 ,
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

const hoursTop = document.getElementById("hours-top");
const hoursBottom = document.getElementById("hours-bottom");
const minutesTop = document.getElementById("minutes-top");
const minutesBottom = document.getElementById("minutes-bottom");
const secondsTop = document.getElementById("seconds-top");
const secondsBottom = document.getElementById("seconds-bottom");

const modal = document.getElementById("admin-modal");
const openAdminButton = document.getElementById("open-admin");
const closeModalButton = document.getElementById("close-modal");
const startButton = document.getElementById("start-button");

const adminPasskey = "12345"; // Set your admin passkey

openAdminButton.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});

startButton.addEventListener("click", () => {
  const enteredPasskey = document.getElementById("admin-passkey").value;
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

// Helper function to format time with two digits
const formatTime = (time) => (time < 10 ? "0" + time : time);
