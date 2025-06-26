let dbPromise;

try {
  dbPromise = idb.openDB("Offline-db", 1, {
    upgrade(db) {
      // Delete old 'users' store if exists to avoid duplicates
      if (db.objectStoreNames.contains("users")) {
        db.deleteObjectStore("users");
      }

      // Create 'users' store with UserID as keyPath to enforce uniqueness
      db.createObjectStore("users", {
        keyPath: "UserID",
      });

      // Create 'busType' store if not already present
      if (!db.objectStoreNames.contains("busType")) {
        db.createObjectStore("busType", {
          keyPath: "BusTypeID",
        });
      }

      // Create 'busNumber' store if not already present
      if (!db.objectStoreNames.contains("busNumbers")) {
        db.createObjectStore("busNumbers", {
          keyPath: "BusTypeID",
        });
      }

      // Create 'inspectionType' store if not already present
      if (!db.objectStoreNames.contains("inspectionType")) {
        db.createObjectStore("inspectionType", {
          keyPath: "CategoryID",
        });
      }

      // Create 'inspectionList' store if not already present
      if (!db.objectStoreNames.contains("inspectionList")) {
        db.createObjectStore("inspectionList", {
          keyPath: "InspectionID",
        });
      }

      // Create 'visualInsQuestions' store if not already present
      if (!db.objectStoreNames.contains("visualInsQuestions")) {
        db.createObjectStore("visualInsQuestions", {
          keyPath: "categoryID",
        });
      }

      // Create 'visualInsQuestionsResponse' store if not already present
      if (!db.objectStoreNames.contains("visualInsQuestionsResponse")) {
        db.createObjectStore("visualInsQuestionsResponse", {
          keyPath: ["InspectionID", "categoryID"],
        });
      }

      // Create 'EngineOpsQuestion' store if not already present
      if (!db.objectStoreNames.contains("EngineOpsQuestionResponse")) {
        db.createObjectStore("EngineOpsQuestionResponse", {
          keyPath: ["InspectionID", "categoryID"],
        });
      }

      // Create 'association-db' store if not already present
      if (!db.objectStoreNames.contains("assiciation-db")) {
        db.createObjectStore("assiciation-db", {
          keyPath: ["InspectionID", "CategoryID"],
        });
      }
    },
  });

  console.log("IndexedDB initialized");
} catch (error) {
  console.error("IndexedDB setup failed:", error);
  throw error;
}

window.dbPromise = dbPromise;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/Client/service-worker.js")
    .then(() => {
      console.log("Service Worker registered from login file");
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
      // document.getElementById("error-notice").style.display = "block";
      // document.getElementById("error-notice").textContent =
      //   "Error: Service Worker failed to register. Offline functionality may be limited.";
    });
} else {
  console.warn("Service Workers not supported in this browser");
  // document.getElementById("error-notice").style.display = "block";
  // document.getElementById("error-notice").textContent =
  //   "Error: Browser does not support Service Workers. Offline functionality unavailable.";
}

// Function to check reliable internet connectivity
async function checkInternetAccess() {
  if (!navigator.onLine) return false;

  try {
    await fetch("https://www.gstatic.com/generate_204", {
      method: "GET",
      mode: "no-cors",
    });
    return true; // online if fetch doesn't throw error
  } catch {
    return false;
  }
}

// Update online/offline banner and sync data
async function updateNetworkStatus() {
  let onlineBanner = document.getElementById("onlineBanner");
  let offlineBanner = document.getElementById("offlineBanner");

  const isOnline = await checkInternetAccess();

  if (isOnline) {
    onlineBanner.style.background = "green";
    offlineBanner.style.background = "gray";
    window.statusCheckId = 1;

    localStorage.setItem("isOnline", JSON.stringify(true));

    try {
      const db = await dbPromise;

      // Fetch and store users
      const userRes = await fetch("https://rta-backend-1.onrender.com/api/user/getUsers");
      if (userRes.ok) {
        const users = await userRes.json();
        for (const user of users) {
          await db.put("users", user); // Uses UserID as unique key
        }
        console.log("User data synced to IndexedDB");
      }

      // Fetch and store bus types
      const busRes = await fetch("https://rta-backend-1.onrender.com/api/busType/get");
      if (busRes.ok) {
        const busTypes = await busRes.json();
        for (const bus of busTypes) {
          await db.put("busType", bus);
        }
        console.log("Bus type data synced to IndexedDB");
      }

      // Fetch and store bus numbers
      const busNumberRes = await fetch("https://rta-backend-1.onrender.com/api/bus/get");
      if (busNumberRes.ok) {
        const busNumber = await busNumberRes.json();
        for (const bus of busNumber) {
          await db.put("busNumbers", bus);
        }
        console.log("Bus type data synced to IndexedDB");
      }

      // Fetch and store bus numbers
      const inspectiontypeRes = await fetch(
        "https://rta-backend-1.onrender.com/api/inspectionCategory/get"
      );
      if (busNumberRes.ok) {
        const inspectionType = await inspectiontypeRes.json();
        for (const insType of inspectionType) {
          await db.put("inspectionType", insType);
        }
        console.log("Inspection type data synced to IndexedDB");
      }

      // Fetch and store Visual Inspection Question
      const visualInsQuestions = await fetch(
        "https://rta-backend-1.onrender.com/api/inspectionQuestion/get"
      );
      if (visualInsQuestions.ok) {
        const visualInsQuestionList = await visualInsQuestions.json();
        for (const visualInsQuestion of visualInsQuestionList) {
          await db.put("visualInsQuestions", visualInsQuestion);
        }
        console.log("visual Inspection Questions data synced to IndexedDB");
      }

      // final sending part when device online

      const inspectionList = await db.getAll("inspectionList");
      console.log("inspectionList : ",inspectionList);
      
      const inspectionListDataToSend = inspectionList[0];
      const inspectionListResponse = await fetch(
        `https://rta-backend-1.onrender.com/api/inspection/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inspectionListDataToSend),
        }
      );
      console.log("inspectionListResponse",inspectionListResponse);

      const assiciationData = await db.getAll("assiciation-db");
      const assiciationDataToSend = assiciationData[0];
      const assiciationDataResponse = await fetch(
        `https://rta-backend-1.onrender.com/api/association/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(assiciationDataToSend),
        }
      );
      console.log("assiciationDataResponse",assiciationDataResponse);

      const allVisualResponseData = await db.getAll("visualInsQuestionsResponse");
      const visualResponseDataToSend = allVisualResponseData[0].postData;
      const visualInspectionID = allVisualResponseData[0].InspectionID;
      const visualCategoryID = allVisualResponseData[0].categoryID;
      const visualInsQuestionResponse = await fetch(
        `https://rta-backend-1.onrender.com/api/inspectionDetails/add/${visualInspectionID}/${visualCategoryID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visualResponseDataToSend),
        }
      );
      console.log("Visualresponse",visualInsQuestionResponse);

      const allEngineResponseData = await db.getAll("EngineOpsQuestionResponse");
      const engineResponseDataToSend = allEngineResponseData[0].postData;
      const engineInspectionID = allEngineResponseData[0].InspectionID;
      const engineCategoryID = allEngineResponseData[0].categoryID;
      const engineInsQuestionResponse = await fetch(
        `https://rta-backend-1.onrender.com/api/inspectionDetails/add/${engineInspectionID}/${engineCategoryID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(engineResponseDataToSend),
        }
      );
      console.log("Engineresponse",engineInsQuestionResponse);
      
    } catch (error) {
      console.error("Failed to fetch API data:", error);
    }
  } else {
    offlineBanner.style.background = "red";
    onlineBanner.style.background = "gray";
    window.statusCheckId = 0;

    localStorage.setItem("isOnline", JSON.stringify(false));

    console.warn("No internet access detected");
  }

  console.log("statusCheckId 12323323:", window.statusCheckId);
}

// Listen to online/offline events
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);

// Initial check
updateNetworkStatus();

// Optional: Periodic check every 10 seconds
setInterval(updateNetworkStatus, 10000);

// Attach to window for external calls
window.updateNetworkStatus = updateNetworkStatus;
