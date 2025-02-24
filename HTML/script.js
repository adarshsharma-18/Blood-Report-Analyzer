// Store user credentials in localStorage (simulating a database)
document.getElementById("registerForm")?.addEventListener("submit", function(event) {
    event.preventDefault();

    let username = document.getElementById("regUsername").value;
    let password = document.getElementById("regPassword").value;

    if (localStorage.getItem(username)) {
        document.getElementById("registerStatus").innerHTML = "<span style='color:red;'>Username already exists!</span>";
    } else {
        localStorage.setItem(username, password);
        document.getElementById("registerStatus").innerHTML = "<span style='color:green;'>Registered successfully! <a href='login3.html'>Login now</a></span>";
    }
});

// Handle login
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let storedPassword = localStorage.getItem(username);

    if (storedPassword && storedPassword === password) {
        sessionStorage.setItem("loggedInUser", username);
        window.location.href = "db.html";
    } else {
        document.getElementById("loginStatus").innerHTML = "<span style='color:red;'>Invalid credentials!</span>";
    }
});

// Protect dashboard - Redirect if not logged in
if (window.location.pathname.includes("dashboard.html")) {
    let user = sessionStorage.getItem("loggedInUser");
    if (!user) {
        window.location.href = "login3.html";
    }
}

// Handle logout
document.querySelector(".logout-btn")?.addEventListener("click", function() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "login3.html";
});

// Handle file upload
document.getElementById("uploadForm")?.addEventListener("submit", function(event) {
    event.preventDefault();

    let fileInput = document.getElementById("fileInput");
    let uploadStatus = document.getElementById("uploadStatus");

    if (fileInput.files.length === 0) {
        uploadStatus.innerHTML = "<span style='color:red;'>Please select a file to upload.</span>";
        return;
    }

    let file = fileInput.files[0];

    if (file.type !== "application/pdf") {
        uploadStatus.innerHTML = "<span style='color:red;'>Only PDF files are allowed.</span>";
        return;
    }

    uploadStatus.innerHTML = "<span style='color:green;'>File uploaded successfully: " + file.name + "</span>";
});
