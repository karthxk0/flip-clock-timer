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
const startButton = document.getElementById("start-button");
const adminPasskey = document.getElementById("admin-passkey");

// Event to open admin control modal
adminButton.addEventListener("click", () => {
    console.log("Admin Control button clicked!");
    adminModal.style.display = "block";
});

// Event to close modal
closeModal.addEventListener("click", () => {
    adminModal.style.display = "none";
});

// Start button event inside the modal
startButton.addEventListener("click", () => {
    const enteredPasskey = adminPasskey.value;
    console.log(`Start Button Clicked, Entered Passkey: ${enteredPasskey}`);
    
    // Set a simple passkey check (replace "12345" with your actual passkey)
    if (enteredPasskey === "12345") {
        adminModal.style.display = "none";
        
        // Start the timer in Firebase
        database.ref("timer").set({
            running: true,
            startTime: Date.now()
        });
    } else {
        alert("Incorrect passkey!");
    }
});

// Function to update the clock display
function updateClock(startTime) {
    const now = Date.now();
    const elapsedTime = now - startTime;

    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    hoursTop.textContent = String(hours).padStart(2, '0');
    minutesTop.textContent = String(minutes).padStart(2, '0');
    secondsTop.textContent = String(seconds).padStart(2, '0');
}

// Listen for changes to the timer in Firebase
database.ref("timer").on("value", (snapshot) => {
    const timerData = snapshot.val();
    if (timerData && timerData.running) {
        console.log("Timer is running!");

        setInterval(() => {
            updateClock(timerData.startTime);
        }, 1000);
    }
});
