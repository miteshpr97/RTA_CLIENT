// // login.js 

// // Load Alert Component
// function loadAlertComponent() {
//   fetch("../Alert/alert.html")
//     .then((response) => response.text())
//     .then((data) => {
//       document.getElementById("alert-container").innerHTML = data;
//     });
// }

// // Handle DOM Content Loaded
// document.addEventListener("DOMContentLoaded", loadAlertComponent);

// // Toggle Password Visibility
// const showPassword = document.querySelector("#showPassword");
// const hidePassword = document.querySelector("#hidePassword");
// const password = document.querySelector("#password");

// showPassword.addEventListener("click", function () {
//   // Show password
//   password.setAttribute("type", "text");
//   showPassword.classList.remove("visible");
//   hidePassword.classList.add("visible");
// });

// hidePassword.addEventListener("click", function () {
//   // Hide password
//   password.setAttribute("type", "password");
//   hidePassword.classList.remove("visible");
//   showPassword.classList.add("visible");
// });



// // Handle Form Submission
// async function handleSubmit(event) {
//   event.preventDefault();
//   const username = document.getElementById("username").value; // Updated ID
//   const password = document.getElementById("password").value; // Updated ID
//   const alert_notice = document.getElementById("alert-notice");

//   if (window.statusCheckId == 1) {
//     try {
//       const response = await fetch(
//         "http://api.rta2.globushub.com/api/user/login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ Username: username, Password: password }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data, "datalogin");

//         localStorage.setItem("data", JSON.stringify(data));
//         localStorage.setItem("token", data.token);
//         window.location.href = "../InspectionCockpit/InspectionCockpit.html";
//       } else if (response.status === 401) {
//         displayError("Invalid username or password.");
//       } else if (response.status === 500) {
//         displayError("Internal server error. Please try again later.");
//       } else {
//         displayError(`Login failed: ${response.status} ${response.statusText}`);
//       }
//     } catch (error) {
//       displayError("An error occurred. Please try again later.");
//       console.error("Error:", error);
//     }
//   } else {
//     // Offline Login using IndexedDB
//     const db = await window.dbPromise;
//     const userList = await db.getAll("users");
//     userList.forEach((user) => {
//       if(user.Username === username && user.Password === password){
//         window.location.href = "../InspectionCockpit/InspectionCockpit.html";
//       }
//       else{
//         alert_notice.innerText = "Invalid username or password";
//       }
//     })
//   }
// }

// // Redirect to Inspection Cockpit
// function redirectToInspectionCockpit() {
//   const basePath = window.location.pathname.substring(
//     0,
//     window.location.pathname.lastIndexOf("/")
//   );
//   window.location.href =
//     basePath + "/../InspectionCockpit/InspectionCockpit.html"; // Goes up one level and into the InspectionCockpit folder
// }



// // Display Error Message
// function displayError(message) {
//   const alertBox = document.getElementById("alert");
//   document.getElementById("error-message").innerText = message;
//   alertBox.style.display = "block";
// }

// // Hide the Alert on Screen Touch or Click
// function hideAlert() {
//   const alertBox = document.getElementById("alert");
//   if (alertBox) {
//     alertBox.style.display = "none";
//   }
// }


// // Attach Event Listeners
// document.addEventListener("click", hideAlert);
// document.addEventListener("touchstart", hideAlert);
// document.getElementById("btn").addEventListener("click", handleSubmit);














// Load Alert Component
function loadAlertComponent() {
  fetch("../Alert/alert.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("alert-container").innerHTML = data;
    })
    .catch((err) => {
      console.error("Failed to load alert component:", err);
    });
}


// let isOnline = localStorage.getItem('isOnline');

// console.log(isOnline);



// Check Online Status
const isOnline = JSON.parse(localStorage.getItem("isOnline"));

console.log("Online Status:", isOnline);




// Toggle Password Visibility
function setupPasswordToggle() {
  const showPassword = document.querySelector("#showPassword");
  const hidePassword = document.querySelector("#hidePassword");
  const password = document.querySelector("#password");

  showPassword.addEventListener("click", () => {
    password.setAttribute("type", "text");
    showPassword.classList.remove("visible");
    hidePassword.classList.add("visible");
  });

  hidePassword.addEventListener("click", () => {
    password.setAttribute("type", "password");
    hidePassword.classList.remove("visible");
    showPassword.classList.add("visible");
  });
}

// Display Error Message
function displayError(message) {
  const alertBox = document.getElementById("alert");
  if (alertBox) {
    document.getElementById("error-message").innerText = message;
    alertBox.style.display = "block";
  }
}

// Hide Error Alert
function hideAlert() {
  const alertBox = document.getElementById("alert");
  if (alertBox) {
    alertBox.style.display = "none";
  }
}

// Redirect on Successful Login
function redirectToInspectionCockpit() {
  window.location.href = "../InspectionCockpit/InspectionCockpit.html";
}
console.log("isOnline : ",isOnline);
// Handle Form Submission
async function handleSubmit(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const alert_notice = document.getElementById("alert-notice");

  if (!username || !password) {
    displayError("Username and password are required.");
    return;
  }



  // ✅ Online Login
  if (isOnline === true) {
    console.log("gggg");
    
    try {
      const response = await fetch("https://rta-backend-1.onrender.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username: username, Password: password }),
      });

      if (response.status == 200) {
        console.log("gggggggggg");
        
        const data = await response.json();
        console.log("Login Succexxcccccccss:", data);

        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("token", data.token);

        redirectToInspectionCockpit();
      } else if (response.status === 401) {
        displayError("Invalid username or password.");
      } else if (response.status === 500) {
        displayError("Server error. Please try again later.");
      } else {
        displayError(`Login failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Login Error:", error);
      displayError("Unable to connect to server. Try again later.");
    }
  }
  // ✅ Offline Login
  else {
    try {
      const db = await window.dbPromise;
      const users = await db.getAll("users");

      console.log(users);
      

      localStorage.setItem("data", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      console.log("Stored Users:", users);

      let foundUser = null;

      for (const user of users) {
        if (user.Username === username) {
          console.log("dkdkdkdk");
          
          const match = await dcodeIO.bcrypt.compare(password, user.Password);
          console.log(match);
          
          console.log("Entered:", password, "| Hashed:", user.Password, "| Match:", match);
          if (match) {
            foundUser = user;
            break;
          }
        }
      }
      if (foundUser) {
        redirectToInspectionCockpit();
      } else {
        alert_notice.innerText = "Invalid username or password";
      }
    } catch (error) {
      console.error("Offline login error:", error);
      displayError("Offline login failed. Please check your data.");
    }
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadAlertComponent();
  setupPasswordToggle();
});

document.addEventListener("click", hideAlert);
document.addEventListener("touchstart", hideAlert);
document.getElementById("btn").addEventListener("click", handleSubmit);
