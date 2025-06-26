let checkStatus = [];
let inspectionID = "";
let selectedCategoryID = "";

const InspectionID = getQueryParam("InspectionID");

const inspectionData = localStorage.getItem("Inspection data");
const isOnline = JSON.parse(localStorage.getItem("isOnline"));

if (inspectionData) {
  try {
    const parsedData = JSON.parse(inspectionData);
    inspectionID = parsedData.InspectionID;
    if (inspectionID === InspectionID) {
      fetchCheckStatus(inspectionID);
    }
  } catch (error) {
    console.error("Error parsing JSON data:", error);
  }
} else {
  console.log("No inspection data found.");
}


async function fetchCheckStatus(inspectionID) {
  try {
    if (isOnline == true) {
      const response = await fetch(
        "https://rta-backend-1.onrender.com/api/association/checkStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ InspectionID: inspectionID }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      checkStatus = await response.json();
      console.log("checkStatus : ", checkStatus);
    } else {
      const db = await window.dbPromise;
      checkStatus = await db.getAll("assiciation-db");
      console.log("offline checkStatus : ", checkStatus);
    }

    fetchInspectionCategory();
  } catch (error) {
    console.error("Error fetching check status:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const userName = document.getElementById("user-info");
  const data = localStorage.getItem("data");

  if (data) {
    try {
      const parsedData = JSON.parse(data);
      userName.innerText = `${parsedData.Username}`;
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  } else {
    console.error("No data found in localStorage");
  }

  loadAlertComponent();
  fetchInspectionCategory();

  const busNumber = getQueryParam("busNumber");
  const displayBusNumberLabel = document.querySelector(".display-bus-number");

  if (displayBusNumberLabel) {
    displayBusNumberLabel.textContent = busNumber;
  }

  document
    .getElementById("backTofuel")
    .addEventListener("click", handleSubmitBackTOfuel);

  document
    .getElementById("inspectionQUestion")
    .addEventListener("click", () => {
      const selectedInspectionElement = document.getElementById(
        "selected-inspection"
      );
      const selectedInspectionText = selectedInspectionElement.textContent;
      const InspectionID = getQueryParam("InspectionID");
      handleSubmitQuestion(selectedInspectionText, InspectionID);
    });
});

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function fetchInspectionCategory() {
  let data;
  try {
    if (isOnline == true) {
      const response = await fetch(
        "https://rta-backend-1.onrender.com/api/inspectionCategory/get"
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      data = await response.json();
    } else {

      const db = await window.dbPromise;
      data = await db.getAll("inspectionType");
    }

    const inspectionTypeContainer = document.getElementById(
      "inspection-type-container"
    );
    inspectionTypeContainer.innerHTML = "";

    const listItems = data
      .map((inspectionType, index) => {

        const status = checkStatus.find(
          (status) => status.CategoryID === inspectionType.CategoryID
        );
        return `
        <li>
          <span class="step-number">${index + 1}</span>
          <span class="step-name">${inspectionType.CategoryName}</span>
          <input type="checkbox" name="inspection" class="inspection-checkbox" id="inspection-type-${
            inspectionType.CategoryID
          }" data-inspection-type-id="${inspectionType.CategoryID}" ${
          status && status.CategoryStatus === "1" ? "checked disabled" : ""
        }>
        </li>
      `;
      })
      .join("");

    inspectionTypeContainer.innerHTML = listItems;
    addCheckboxEventListeners();
  } catch (error) {
    console.error("Error fetching inspection category data:", error);
  }
}

function addCheckboxEventListeners() {
  document.querySelectorAll(".inspection-checkbox").forEach((checkbox) => {
    //console.log(checkbox);

    checkbox.addEventListener("change", function () {
      const categoryID = this.dataset.inspectionTypeId;
      console.log("Checkbox clicked. CategoryID:", categoryID);

      // Update the global variable with the selected CategoryID
      if (this.checked) {
        selectedCategoryID = categoryID;

        // Ensure only one checkbox is checked at a time
        document.querySelectorAll(".inspection-checkbox").forEach((cb) => {
          if (cb !== this && !cb.disabled) {
            cb.checked = false;
          }
        });

        console.log(`Checkbox Checked: ${checkbox.checked}`);
        console.log(`Checkbox ID: ${checkbox.id}`);
        console.log(
          `Bus Type Name: ${checkbox.previousElementSibling.textContent}`
        );

        updateSelectedInspection();
      } else {
        selectedCategoryID = "";
      }
    });
  });
}

function updateSelectedInspection() {
  const selectedCheckbox = Array.from(
    document.querySelectorAll(".inspection-checkbox")
  ).find((checkbox) => checkbox.checked && !checkbox.disabled);

  const selectedInspectionElement = document.getElementById(
    "selected-inspection"
  );

  if (selectedCheckbox) {
    const selectedInspectionText =
      selectedCheckbox.previousElementSibling.textContent;
    const inspectId = selectedCheckbox.dataset.inspectionTypeId;

    selectedInspectionElement.textContent = selectedInspectionText;
    selectedInspectionElement.setAttribute("data-inspection-id", inspectId);
  } else {
    selectedInspectionElement.textContent = "";
    selectedInspectionElement.removeAttribute("data-inspection-id");
  }

  console.log(
    "Final Selected Inspection Text:",
    selectedInspectionElement.textContent
  );
}

function redirectToPage(categoryID, inspectionID) {
  const busNumber = getQueryParam("busNumber");
  const inspection = getQueryParam("inspection");
  const busTypeID = getQueryParam("busTypeId");
  const busID = getQueryParam("busID");
  const odometer = getQueryParam("odometer");
  const fuelLevel = getQueryParam("fuelLevel");

  const queryString = `busNumber=${busNumber}&inspection=${inspection}&busTypeId=${busTypeID}&busID=${busID}&odometer=${odometer}&fuelLevel=${fuelLevel}&categoryID=${categoryID}&InspectionID=${inspectionID}`;
  switch (categoryID) {
    case "IC001":
      window.location.href = `../Questions/visualinsQuestion/visualQ1.html?${queryString}`;
      break;
    case "IC003":
      window.location.href = `../Questions/EngineOpsQuestion/engineQ1.html?${queryString}`;
      break;
    // Add more cases as needed
    default:
      console.error(`No redirection defined for CategoryID: ${categoryID}`);
      break;
  }
}

function handleSubmitBackTOfuel() {
  const busNumber = getQueryParam("busNumber");
  const inspection = getQueryParam("inspection");
  const busTypeID = getQueryParam("busTypeId");
  const busID = getQueryParam("busID");

  const queryParams = new URLSearchParams({
    inspection: inspection,
    busTypeId: busTypeID,
    busID: busID,
    busNumber: busNumber,
  });

  window.location.href = `../BusReading/BusReading.html?${queryParams.toString()}`;
}

async function handleSubmitQuestion(selectedInspectionText, InspectionID) {
  if (!selectedInspectionText) {
    displayError("Please select an inspection type before proceeding.");
    return;
  }

  // Ensure that a checkbox is selected before proceeding
  if (!selectedCategoryID) {
    displayError("Please select an inspection type before proceeding.");
    return;
  }

  let postData = {
    InspectionID: InspectionID,
    CategoryID: selectedCategoryID, // Use the globally stored CategoryID
  };

  // console.log("Submitting with CategoryID:", postData);

  try {
    if (isOnline == true) {
      const response = await fetch(
        "https://rta-backend-1.onrender.com/api/association/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          // Conflict status code for duplicates
          throw new Error(
            "A record with this InspectionID and CategoryID already exists."
          );
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Data successfully posted:", data);
    } else {
      postData = { ...postData, CategoryStatus: "0" };
      const db = await window.dbPromise;
      await db.put("assiciation-db", postData);
      console.log("assiciation-db data synced to IndexedDB");
    }
    redirectToPage(selectedCategoryID, InspectionID);

    localStorage.setItem("Inspection data", JSON.stringify(postData));
  } catch (error) {
    console.error("Error posting data:", error);
    displayError(
      error.message ||
        "There was an error submitting your request. Please try again."
    );
  }
}

function displayError(message) {
  const alertBox = document.getElementById("alert");
  if (alertBox) {
    document.getElementById("error-message").innerText = message;
    alertBox.style.display = "block";
  }
}

function hideAlert(event) {
  const alertBox = document.getElementById("alert");
  if (alertBox && !event.target.classList.contains("btn")) {
    alertBox.style.display = "none";
  }
}

function displaySuccess(message) {
  fetch("../Alert/successful.html")
    .then((response) => response.text())
    .then((data) => {
      const alertContainer = document.getElementById("alert-container");
      alertContainer.innerHTML = data;
      const successMessageElement =
        alertContainer.querySelector("#success-message");

      if (successMessageElement) {
        successMessageElement.textContent = message;
      }
      const successCloseButton = alertContainer.querySelector("#button");
      successCloseButton.addEventListener("click", () => {
        console.log("Close");
        const basePath = window.location.pathname.substring(
          0,
          window.location.pathname.lastIndexOf("/")
        );
        window.location.href =
          basePath + "/../InspectionCockpit/InspectionCockpit.html";
      });
    })
    .catch((error) =>
      console.error("Error loading successful component:", error)
    );
}

let Inspection = [], success = false;
async function checkSuccessful(inspectionId) {
  try {
    if (isOnline == true) {
      const response = await fetch(
        `https://rta-backend-1.onrender.com/api/inspection/${inspectionId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      Inspection = data[0];
    } else {
      const db = await window.dbPromise;
      const allData = await db.getAll("assiciation-db");
      const allInspectionListData = await db.getAll("inspectionList");
      const InspectionListData = allInspectionListData[0];
      const addInspectionStatus = {...InspectionListData, InspectionStatus : "1"}
      await db.put("inspectionList", addInspectionStatus)

      const filteredData = allData.filter(
        (item) =>
          item.InspectionID === inspectionId && (item.CategoryID === "IC001"  || item.CategoryID === "IC003")  && item.CategoryStatus === "1"
      );
      
      if(filteredData.length == 2){
        success = true;
      }
    }
    // const inspection = Inspection.find(item => item.InspectionID === inspectionId);
    if (success === true || Inspection.InspectionStatus === "1") {
      // alert('Successful create Inspection');
      //  window.location.href = '../InspectionCockpit/InspectionCockpit.html';

      displaySuccess("Successful create Inspection");
      localStorage.removeItem("Inspection data");
    } else {
      console.log("No match found or status is not 1.");
    }
  } catch (error) {
    console.error("Error fetching inspection data:", error.message);
  }
}

checkSuccessful(InspectionID);

document.addEventListener("click", hideAlert);
document.addEventListener("touchstart", hideAlert);

function loadAlertComponent() {
  fetch("../Alert/alert.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("alert-container").innerHTML = data;
    })
    .catch((error) => console.error("Error loading alert component:", error));
}
