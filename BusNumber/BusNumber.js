// old code

// function loadAlertComponent() {
//   fetch("../Alert/alert.html")
//     .then((response) => response.text())
//     .then((data) => {
//       const alertContainer = document.getElementById("alert-container");
//       if (alertContainer) {
//         alertContainer.innerHTML = data;
//       }
//     });
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const userName = document.getElementById("user-info");
//   const data = localStorage.getItem("data");

//   loadAlertComponent();

//   if (data) {
//     const parsedData = JSON.parse(data);
//     userName.innerText = `${parsedData.Username}`;
//   } else {
//     console.error("No data found in localStorage");
//   }

//   // Function to get query parameter
//   function getQueryParam(name) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(name);
//   }

//   const busTypeId = getQueryParam("busTypeId");
//   let selectedBusID = "";

//   if (busTypeId) {
//     fetchBusTypeData();
//   } else {
//     console.error("No busTypeId query parameter found in the URL.");
//   }

//   async function fetchBusTypeData() {
//     try {
//       const response = await fetch(
//         `https://api.rta2.globushub.com/api/bus/get/${busTypeId}`
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const responseData = await response.json();
//       console.log(responseData);

//       const busDetailsString = responseData[0].BusDetails;
//       if (busDetailsString) {
//         const busDetailsArray = JSON.parse(busDetailsString);
//         console.log("Bus Details Array:", busDetailsArray);
//         populateDropdown(busDetailsArray);
//       } else {
//         displayError("BusDetails is empty or not found in API response!");
//         console.error("BusDetails is empty or not found in API response.");
//       }
//     } catch (error) {
//       displayError("Error fetching bus type data!");
//       console.error("Error fetching bus type data:", error);
//     }
//   }

//   function populateDropdown(busDetails) {
//     const dropdownMenu = document.querySelector(".dropdown-menu");
//     if (!dropdownMenu) {
//       console.error("Dropdown menu element not found.");
//       return;
//     }
//     dropdownMenu.innerHTML = "";

//     if (busDetails.length === 0) {
//       console.warn("No bus details available to populate.");
//       return;
//     }

//     busDetails.forEach((detail) => {
//       const listItem = document.createElement("li");
//       const link = document.createElement("a");
//       link.className = "dropdown-item";
//       link.href = "#";
//       link.textContent = detail.BusNumber;
//       link.addEventListener("click", () => {
//         busNumberInput.value = detail.BusNumber;
//         selectedBusID = detail.BusID;
//         updateBusNumberDisplay();
//       });
//       listItem.appendChild(link);
//       dropdownMenu.appendChild(listItem);
//     });
//   }

//   const busNumberInput = document.getElementById("station-input");

//   function updateBusNumberDisplay() {
//     const displayBusNumberLabel = document.getElementById("display-bus-number");

//     if (busNumberInput && displayBusNumberLabel) {
//       displayBusNumberLabel.textContent = busNumberInput.value.toUpperCase();
//     }
//   }

//   busNumberInput.addEventListener("input", updateBusNumberDisplay);

//   console.log(busNumberInput);

//   const InspectionCockpitName = getQueryParam("inspection");

//   document
//     .getElementById("backInspec")
//     .addEventListener("click", handleSubmitBack);
//   document
//     .getElementById("busNumberSubmit")
//     .addEventListener("click", handleSubmit);

//   function handleSubmitBack() {
//     window.location.href = "../InspectionCockpit/InspectionCockpit.html";
//   }

//   function handleSubmit() {
//     const busNumber = busNumberInput.value.toUpperCase();
//     if (!busNumber) {
//       displayError("Please enter a bus number before submitting!");
//       return;
//     }
//     const queryParams = new URLSearchParams({
//       inspection: InspectionCockpitName,
//       busTypeId: busTypeId,
//       busNumber: busNumber,
//       busID: selectedBusID,
//     });
//     window.location.href = `../BusReading/BusReading.html?${queryParams.toString()}`;
//   }

//   function displayError(message) {
//     const alertBox = document.getElementById("alert");
//     document.getElementById("error-message").innerText = message;
//     alertBox.style.display = "block";
//   }

//   function hideAlert(event) {
//     const alertBox = document.getElementById("alert");
//     if (event.target.classList[0] === "btn") {
//       return;
//     }
//     if (alertBox) {
//       alertBox.style.display = "none";
//     }
//   }

//   function resetInput() {
//     const busNumberInput = document.getElementById("station-input");
//     const displayBusNumberLabel = document.getElementById("display-bus-number");

//     if (busNumberInput && displayBusNumberLabel) {
//       busNumberInput.value = ""; // Clear the input
//       displayBusNumberLabel.textContent = ""; // Clear the displayed number
//       busNumberInput.focus(); // Autofocus the input
//       updateBusNumberDisplay(); // Ensure display is updated
//     }
//   }

//   const resetButton = document.getElementById("restInput");
//   if (resetButton) {
//     resetButton.addEventListener("click", resetInput);
//   }

//   document.addEventListener("click", hideAlert);
//   document.addEventListener("touchstart", hideAlert);
// });

// document.addEventListener("DOMContentLoaded", () => {
//   let validBusNumbers = []; // Array to store valid bus numbers
//   let selectedBusID = "";

//   function getQueryParam(name) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(name);
//   }

//   const busTypeId = getQueryParam("busTypeId");

//   if (busTypeId) {
//     fetchBusTypeData();
//   } else {
//     console.error("No busTypeId query parameter found in the URL.");
//   }

//   async function fetchBusTypeData() {
//     try {
//       const response = await fetch(
//         `https://api.rta2.globushub.com/api/bus/get/${busTypeId}`
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const responseData = await response.json();
//       console.log(responseData);

//       const busDetailsString = responseData[0].BusDetails;
//       if (busDetailsString) {
//         const busDetailsArray = JSON.parse(busDetailsString);
//         console.log("Bus Details Array:", busDetailsArray);
//         populateDropdown(busDetailsArray);
//       } else {
//         displayError("BusDetails is empty or not found in API response!");
//         console.error("BusDetails is empty or not found in API response.");
//       }
//     } catch (error) {
//       displayError("Error fetching bus type data!");
//       console.error("Error fetching bus type data:", error);
//     }
//   }

//   function populateDropdown(busDetails) {
//     const dropdownMenu = document.querySelector(".dropdown-menu");
//     if (!dropdownMenu) {
//       console.error("Dropdown menu element not found.");
//       return;
//     }
//     dropdownMenu.innerHTML = ""; // Clear existing items

//     if (busDetails.length === 0) {
//       console.warn("No bus details available to populate.");
//       return;
//     }

//     validBusNumbers = busDetails.map((detail) => detail.BusNumber.toUpperCase()); // Store valid bus numbers

//     busDetails.forEach((detail) => {
//       const listItem = document.createElement("li");
//       const link = document.createElement("a");
//       link.className = "dropdown-item";
//       link.href = "#";
//       link.textContent = detail.BusNumber;
//       link.addEventListener("click", () => {
//         busNumberInput.value = detail.BusNumber;
//         selectedBusID = detail.BusID;
//         updateBusNumberDisplay();
//       });
//       listItem.appendChild(link);
//       dropdownMenu.appendChild(listItem);
//     });
//   }

//   const busNumberInput = document.getElementById("station-input");

//   function updateBusNumberDisplay() {
//     const displayBusNumberLabel = document.getElementById("display-bus-number");

//     if (busNumberInput && displayBusNumberLabel) {
//       displayBusNumberLabel.textContent = busNumberInput.value.toUpperCase();
//     }
//   }

//   busNumberInput.addEventListener("input", updateBusNumberDisplay);

//   const InspectionCockpitName = getQueryParam("inspection");

//   document
//     .getElementById("backInspec")
//     .addEventListener("click", handleSubmitBack);
//   document
//     .getElementById("busNumberSubmit")
//     .addEventListener("click", handleSubmit);

//   function handleSubmitBack() {
//     window.location.href = "../InspectionCockpit/InspectionCockpit.html";
//   }

//   function handleSubmit() {
//     const busNumber = busNumberInput.value.toUpperCase();
//     if (!busNumber) {
//       displayError("Please enter a bus number before submitting!");
//       return;
//     }

//     // Validate if the entered bus number is valid
//     if (!validBusNumbers.includes(busNumber)) {
//       displayError("Invalid bus number entered! Please select a valid bus number.");
//       return;
//     }

//     const queryParams = new URLSearchParams({
//       inspection: InspectionCockpitName,
//       busTypeId: busTypeId,
//       busNumber: busNumber,
//       busID: selectedBusID,
//     });
//     window.location.href = `../BusReading/BusReading.html?${queryParams.toString()}`;
//   }

//   // Display error message
//   function displayError(message) {
//     const alertBox = document.getElementById("alert");
//     document.getElementById("error-message").innerText = message;
//     alertBox.style.display = "block";
//   }

//   function hideAlert(event) {
//     const alertBox = document.getElementById("alert");
//     if (event.target.classList[0] === "btn") {
//       return;
//     }
//     if (alertBox) {
//       alertBox.style.display = "none";
//     }
//   }

//   const resetButton = document.getElementById("restInput");
//   if (resetButton) {
//     resetButton.addEventListener("click", resetInput);
//   }

//   function resetInput() {
//     busNumberInput.value = ""; // Clear the input
//     updateBusNumberDisplay(); // Update the display
//     busNumberInput.focus(); // Autofocus the input
//   }

//   document.addEventListener("click", hideAlert);
//   document.addEventListener("touchstart", hideAlert);
// });

document.addEventListener("DOMContentLoaded", () => {
  let validBusNumbers = [];
  let selectedBusID = "";

  // Function to load the alert component dynamically
  function loadAlertComponent() {
    fetch("../Alert/alert.html")
      .then((response) => response.text())
      .then((data) => {
        const alertContainer = document.getElementById("alert-container");
        if (alertContainer) {
          alertContainer.innerHTML = data;
        }
      })
      .catch((error) => {
        console.error("Error loading alert component:", error);
      });
  }

  loadAlertComponent();

  function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const busTypeId = getQueryParam("busTypeId");

  if (busTypeId) {
    fetchBusTypeData();
  } else {
    console.error("No busTypeId query parameter found in the URL.");
  }

  async function fetchBusTypeData() {
    let responseData, busDetailsArray;

    console.log(navigator.onLine)
    try {
      if (window.statusCheckId == 1) {
        const response = await fetch(
          `https://rta-backend-1.onrender.com/api/bus/get/${busTypeId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        responseData = await response.json();
        busDetailsArray = responseData[0].BusDetails;
      } else {
        const db = await window.dbPromise;
        const data = await db.getAll("busNumbers");
        const matchedItem = data.find((item) => item.BusTypeID === busTypeId);
        const responseData = matchedItem ? matchedItem.BusDetails : null;
        busDetailsArray = responseData;
      }

      //const busDetailsArray = responseData[0].BusDetails;
      if (busDetailsArray) {
        populateDropdown(busDetailsArray);
      } else {
        displayErrorFromAlert(
          "BusDetails is empty or not found in API response!"
        );
        console.error("BusDetails is empty or not found in API response.");
      }
    } catch (error) {
      displayErrorFromAlert("Error fetching bus type data!");
      console.error("Error fetching bus type data:", error);
    }
  }

  function populateDropdown(busDetails) {
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (!dropdownMenu) {
      console.error("Dropdown menu element not found.");
      return;
    }
    dropdownMenu.innerHTML = "";

    if (busDetails.length === 0) {
      console.warn("No bus details available to populate.");
      return;
    }

    validBusNumbers = busDetails.map((detail) =>
      detail.BusNumber.toUpperCase()
    );

    busDetails.forEach((detail) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.className = "dropdown-item";
      link.href = "#";
      link.textContent = detail.BusNumber;
      link.addEventListener("click", () => {
        busNumberInput.value = detail.BusNumber;
        selectedBusID = detail.BusID;
        updateBusNumberDisplay();
      });
      listItem.appendChild(link);
      dropdownMenu.appendChild(listItem);
    });
  }

  const busNumberInput = document.getElementById("station-input");

  function updateBusNumberDisplay() {
    const displayBusNumberLabel = document.getElementById("display-bus-number");

    if (busNumberInput && displayBusNumberLabel) {
      displayBusNumberLabel.textContent = busNumberInput.value.toUpperCase();
    }
  }

  busNumberInput.addEventListener("input", updateBusNumberDisplay);

  const InspectionCockpitName = getQueryParam("inspection");

  document
    .getElementById("backInspec")
    .addEventListener("click", handleSubmitBack);
  document
    .getElementById("busNumberSubmit")
    .addEventListener("click", handleSubmit);

  function handleSubmitBack() {
    window.location.href = "../InspectionCockpit/InspectionCockpit.html";
  }

  function handleSubmit() {
    const busNumber = busNumberInput.value.toUpperCase();
    if (!busNumber) {
      displayErrorFromAlert("Please enter a bus number before submitting!");
      return;
    }

    // Validate if the entered bus number is valid
    if (!validBusNumbers.includes(busNumber)) {
      displayErrorFromAlert(
        "Invalid bus number entered! Please select a valid bus number."
      );
      return;
    }

    const queryParams = new URLSearchParams({
      inspection: InspectionCockpitName,
      busTypeId: busTypeId,
      busNumber: busNumber,
      busID: selectedBusID,
    });
    window.location.href = `../BusReading/BusReading.html?${queryParams.toString()}`;
  }

  // Display error message inside alert component loaded from alert.html
  function displayErrorFromAlert(message) {
    const alertBox = document.getElementById("alert");
    const errorMessage = document.getElementById("error-message");

    if (alertBox && errorMessage) {
      errorMessage.innerText = message;
      alertBox.style.display = "block";

      // Hide the alert after 2 seconds (2000 ms)
      setTimeout(() => {
        alertBox.style.display = "none";
      }, 2000);
    }
  }

  // Hide the alert on screen touch or click
  function hideAlert(event) {
    const alertBox = document.getElementById("alert");
    if (event.target.classList[0] === "btn") {
      return;
    }
    if (alertBox) {
      alertBox.style.display = "none";
    }
  }

  const resetButton = document.getElementById("restInput");
  if (resetButton) {
    resetButton.addEventListener("click", resetInput);
  }

  function resetInput() {
    busNumberInput.value = "";
    updateBusNumberDisplay();
    busNumberInput.focus();
  }

  document.addEventListener("click", hideAlert);
  document.addEventListener("touchstart", hideAlert);
});
