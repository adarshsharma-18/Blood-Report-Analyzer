document.addEventListener("DOMContentLoaded", function () {
    const sections = ["instructions", "profile", "upload", "blood-info", "references", "terminology", "health-practices"];
    const sidebarLinks = document.querySelectorAll(".sidebar a:not(.logout-btn)");
    const logoutBtn = document.querySelector(".logout-btn");

    function showSection(sectionId) {
        sections.forEach(sec => {
            let section = document.getElementById(sec);
            if (section) {
                section.style.display = sec === sectionId ? "block" : "none";
            }
        });

        sidebarLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href").substring(1) === sectionId);
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let sectionId = this.getAttribute("href").substring(1);
            showSection(sectionId);
        });
    });

    logoutBtn.addEventListener("click", function () {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "login3.html";
    });

    document.getElementById("uploadForm")?.addEventListener("submit", async function (event) {
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

        let formData = new FormData();
        formData.append("file", file);

        uploadStatus.innerHTML = "<span style='color:blue;'>Uploading...</span>";

        try {
            let response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData
            });

            let data = await response.json();

            if (response.ok) {
                uploadStatus.innerHTML = "<span style='color:green;'>File uploaded successfully!</span>";

                // Open the extracted table in a new tab
                let newTab = window.open();
                newTab.document.write(`
                    <html>
                    <head>
                        <title>Blood Report Summary</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                            h2 { color: #d9534f; text-align: center; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                        </style>
                    </head>
                    <body>
                        <h2>Blood Report Summary</h2>
                        ${data.table_html}
                    </body>
                    </html>
                `);
                newTab.document.close();
            } else {
                uploadStatus.innerHTML = `<span style='color:red;'>${data.error}</span>`;
            }
        } catch (error) {
            uploadStatus.innerHTML = "<span style='color:red;'>Error uploading file. Please check if the backend is running.</span>";
        }
    });

    showSection("instructions");
});
