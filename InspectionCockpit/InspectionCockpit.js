
// let dbPromise;
// try {
//   dbPromise = idb.openDB("Offline-db", 1, {
//     upgrade(db) {
//       db.createObjectStore("users", {
//         keyPath: "id",
//         autoIncrement: true,
//       });
//       db.createObjectStore("busType", {
//         keyPath: "id",
//         autoIncrement: true,
//       });
//     },
//   });
//   console.log("IndexedDB initialized");
// } catch (error) {
//   // document.getElementById("error-notice").style.display = "block";
//   // document.getElementById("error-notice").textContent =
//   //   "Error: Failed to initialize database. Please try again.";
//   console.error("IndexedDB setup failed:", error);
//   throw error;
// }



function loadAlertComponent() {
  fetch("../Alert/alert.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to load alert component: ${response.status} ${response.statusText}`
        );
      }
      return response.text();
    })
    .then((data) => {
      const alertContainer = document.getElementById("alert-container");
      if (alertContainer) {
        alertContainer.innerHTML = data;
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
}


const isOnline = localStorage.getItem('isOnline');



// Function to fetch bus type data
async function fetchBusTypeData() {
  let data, busTypeContainer;
  // ✅ Online Login

  console.log(data, "here is bus type data show");
  
  try {

    if (isOnline == true) {
      const response = await fetch(
        "https://rta-backend-1.onrender.com/api/busType/get"
      );

      if (!response.ok) {
        if (response.status === 401) {
          displayError("Invalid username or password.");
        } else if (response.status === 500) {
          displayError("Internal server error. Please try again later.");
        } else {
          displayError(
            `Fetching bus type failed: ${response.status} ${response.statusText}`
          );
        }
        return; // Exit function if response is not OK
      }

      data = await response.json();
      console.log("online data",data);
      busTypeContainer = document.getElementById("bus-type-container");
    }
    else{
      const db = await window.dbPromise;
      console.log(dbPromise);
      
      data = await db.getAll("busType");
      busTypeContainer = document.getElementById("bus-type-container");
    }
    data.forEach((busType) => {
      const listItem = document.createElement("li");
      const stepNumber = document.createElement("span");
      stepNumber.className = "step-number";
      stepNumber.textContent = busType.BusTypeID.replace("BT00", "");

      const stepName = document.createElement("span");
      stepName.className = "step-name";
      stepName.textContent = busType.BusType;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "inspection";
      checkbox.className = "inspection-checkbox";
      checkbox.id = `bus-type-${busType.BusTypeID}`;
      checkbox.dataset.busTypeId = busType.BusTypeID;

      listItem.appendChild(stepNumber);
      listItem.appendChild(stepName);
      listItem.appendChild(checkbox);

      busTypeContainer.appendChild(listItem);
    });

    initializeInspectionCheckboxes();
  } catch (error) {
    console.error("Fetching bus type failed:", error.message);
    displayError(`Fetching bus type failed: ${error.message}`);
  }
}

// Function to initialize inspection checkboxes
function initializeInspectionCheckboxes() {
  const checkboxes = document.querySelectorAll(".inspection-checkbox");
  const selectedInspectionElement = document.getElementById(
    "selected-inspection"
  );

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      // Ensure only one checkbox is selected at a time
      checkboxes.forEach((cb) => {
        if (cb !== checkbox) cb.checked = false;
      });

      console.log(`Checkbox Checked: ${checkbox.checked}`);
      console.log(`Checkbox ID: ${checkbox.id}`);
      console.log(
        `Bus Type Name: ${checkbox.previousElementSibling.textContent}`
      );

      // Update the selected inspection text
      if (checkbox.checked) {
        selectedInspectionElement.textContent =
          checkbox.previousElementSibling.textContent;
        window.selectedBusTypeId = checkbox.dataset.busTypeId;
      } else {
        selectedInspectionElement.textContent = "None";
        window.selectedBusTypeId = null;
      }
    });
  });

  window.selectedBusTypeId = null; // Initialize selectedBusTypeId to null
}

// Function to handle form submission
function handleSubmit() {
  const selectedInspectionElement = document.getElementById(
    "selected-inspection"
  );
  const selectedInspectionText = selectedInspectionElement.textContent;
  const busTypeId = window.selectedBusTypeId;

  if (
    selectedInspectionText &&
    selectedInspectionText !== "None" &&
    busTypeId
  ) {
    window.location.href = `../BusNumber/BusNumber.html?inspection=${encodeURIComponent(
      selectedInspectionText
    )}&busTypeId=${encodeURIComponent(busTypeId)}`;
  } else {
    displayError("Please select an inspection before proceeding.");
  }
}

// Function to display an error message
function displayError(message) {
  const alertBox = document.getElementById("alert");
  document.getElementById("error-message").innerText = message;
  alertBox.style.display = "block";
}

// Function to hide the alert on screen touch or click
function hideAlert(event) {
  const alertBox = document.getElementById("alert");
  if (event.target.classList[0] === "btn") {
    return;
  }
  if (alertBox) {
    alertBox.style.display = "none";
  }
}

// Event listeners for DOM content loaded and alert hiding
document.addEventListener("DOMContentLoaded", () => {
  const userName = document.getElementById("user-info");
  const data = localStorage.getItem("data");
  console.log(data, "logininfodata");

  if (data) {
    const parsedData = JSON.parse(data);
    userName.innerText = `${parsedData.Username}`;
  } else {
    console.error("No data found in localStorage");
  }

  loadAlertComponent();
  fetchBusTypeData();
  initializeInspectionCheckboxes();

  document.getElementById("insecpBtn").addEventListener("click", handleSubmit);
});

document.addEventListener("click", hideAlert);
document.addEventListener("touchstart", hideAlert);