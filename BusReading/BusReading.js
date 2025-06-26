
// Function to load the alert component
function loadAlertComponent() {
  fetch("../Alert/alert.html")
    .then((response) => response.text())
    .then((data) => {
      const alertContainer = document.getElementById("alert-container");

      if (alertContainer) {
        alertContainer.innerHTML = data;
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadAlertComponent();
});

// Get user info from localStorage
const userName = document.getElementById("user-info");
const data = localStorage.getItem("data");

if (data) {
  const parsedData = JSON.parse(data);
  userName.innerText = `${parsedData.Username}`;
} else {
  console.error("No data found in localStorage");
}

// Function to get query parameters
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Get necessary query parameters
const busNumber = getQueryParam("busNumber");
const inspection = getQueryParam("inspection");
const busTypeID = getQueryParam("busTypeId");
const busID = getQueryParam("busID");

const displayBusNumberLabel = document.querySelector(".display-bus-number");
if (displayBusNumberLabel) {
  displayBusNumberLabel.textContent = busNumber;
}

// Event listeners for buttons
document
  .getElementById("backBusInput")
  .addEventListener("click", handleSubmitBack);
document.getElementById("submitFuel").addEventListener("click", submitFuel);

function handleSubmitBack() {
  const queryParams = new URLSearchParams({
    inspection: inspection,
    busTypeId: busTypeID,
  });
  window.location.href = `../BusNumber/BusNumber.html?${queryParams.toString()}`;
}

const isOnline = JSON.parse(localStorage.getItem("isOnline"));


console.log(isOnline, "bus reading page");


async function submitFuel() {
  const odometer = document.getElementById("odometerInput").value;
  const fuelLevel = document.getElementById("fuelLevelInput").value;

  if (!odometer || !fuelLevel) {
    displayError("Please enter both odometer and fuel level values!");
    return;
  }

  // Retrieve the UserID from localStorage data (assuming it's stored there)
  const userData = JSON.parse(localStorage.getItem("data"));
  const userID = userData ? userData.UserID : null;

  // Check if userID is available
  if (!userID) {
    displayError("User not logged in or UserID missing!");
    return;
  }

  let postData = {
    UserID: userID,
    BusID: busID,
    Odometer: odometer,
    FuelLevel: fuelLevel,
    LocationID: "LC003",
  };
  


  // Get current date in YYYYMMDD format
      // const now = new Date();
      // const formattedDate = now.toISOString().slice(0, 10).replace(/-/g, "");

      // Add a 4-digit random number
      //const randomPart = Math.floor(1000 + Math.random() * 9000);

      // Final inspection ID
      let inspectionID = Math.floor(1000 + Math.random() * 9000)+`${userID}`;
      postData = {...postData, InspectionID: inspectionID};
  try {
    if (isOnline == true) {

      const response = await fetch("https://rta-backend-1.onrender.com/api/inspection/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      inspectionID = data.InspectionID;
    } else {
      const db = await window.dbPromise;
      if (!db) throw new Error("IndexedDB not initialized properly.");
      await db.put("inspectionList", postData);
      console.log("Inspection type data synced to IndexedDB");

    }

    const queryParams = new URLSearchParams({
      inspection: inspection,
      busTypeId: busTypeID,
      busNumber: busNumber,
      busID: busID,
      odometer: odometer,
      fuelLevel: fuelLevel,
      InspectionID: inspectionID,
    });

    // Uncomment to redirect
    window.location.href = `../InspectionType/InspectionType.html?${queryParams.toString()}`;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    displayError("Failed to submit data. Please try again.");
  }
}

// Display error message
function displayError(message) {
  const alertBox = document.getElementById("alert");
  document.getElementById("error-message").innerText = message;
  alertBox.style.display = "block";
}

// Hide the alert on screen touch or click
function hideAlert(event) {
  const alertBox = document.getElementById("alert");
  if (event.target.classList[0] == "btn") {
    return;
  }
  if (alertBox) {
    alertBox.style.display = "none";
  }
}

document.addEventListener("click", hideAlert);
document.addEventListener("touchstart", hideAlert);
