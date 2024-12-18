const form = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission until coordinates are captured

    // Default coordinates if geolocation fails (could also be empty strings or a default location)
    let latitude = "unknown";
    let longitude = "unknown";

    // check if password and confirmPassword match 
    const password = document.querySelector('input[name="password"]');
    const confirmPassword = document.querySelector('input[name="confirm_password"]');
    if (password.value !== confirmPassword.value) {
        errorMessage.textContent = "Passwords do not match.";

        // change errorMessage class to error 
        if (errorMessage.classList.contains("warning")) {
            errorMessage.classList.remove('warning');
        }
        if (!errorMessage.classList.contains("error")) {
            errorMessage.classList.add("error");
        }
        // display error 
        errorMessage.style.display = "block";
    }

    // Check if Geolocation is available
    else if ("geolocation" in navigator) {
        // Request location
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                // Set values in hidden fields
                latitudeInput.value = latitude;
                longitudeInput.value = longitude;

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                try {
                    const response = await fetch(form.action, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // Redirect on success
                        if (result.success) {
                            window.location.href = result.redirect;
                        }
                    } else {
                        // Display error message
                        errorMessage.textContent = result.error || "An unknown error occurred.";

                        // change errorMessage class to error
                        if (errorMessage.classList.contains("warning")) {
                            errorMessage.classList.remove('warning');
                        }
                        if (!errorMessage.classList.contains("error")) {
                            errorMessage.classList.add("error");
                        }
                        errorMessage.style.display = "block";
                    }
                } catch (err) {
                    console.error("Error:", err);
                    errorMessage.textContent = "A network error occurred.";

                    // change errorMessage class to error
                    if (errorMessage.classList.contains("warning")) {
                        errorMessage.classList.remove('warning');
                    }
                    if (!errorMessage.classList.contains("error")) {
                        errorMessage.classList.add("error");
                    }
                    errorMessage.style.display = "block";
                }

            },
            (error) => {
                // Handle geolocation errors
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage.innerText = "User denied the request for Geolocation.";
                        // change errorMessage class to warning
                        if (errorMessage.classList.contains("error")) {
                            errorMessage.classList.remove('error');
                        }
                        if (!errorMessage.classList.contains("warning")) {
                            errorMessage.classList.add("warning");
                        }
                        errorMessage.style.display = "block";
                        break;

                    case error.POSITION_UNAVAILABLE:
                        errorMessage.innerText = "Location information is unavailable.";
                        // change errorMessage class to warning
                        if (errorMessage.classList.contains("error")) {
                            errorMessage.classList.remove('error');
                        }
                        if (!errorMessage.classList.contains("warning")) {
                            errorMessage.classList.add("warning");
                        }
                        errorMessage.style.display = "block";
                        break;

                    case error.TIMEOUT:
                        errorMessage.innerText = "The request to get user location timed out.";
                        // change errorMessage class to warning
                        if (errorMessage.classList.contains("error")) {
                            errorMessage.classList.remove('error');
                        }
                        if (!errorMessage.classList.contains("warning")) {
                            errorMessage.classList.add("warning");
                        }
                        errorMessage.style.display = "block";
                        break;

                    case error.UNKNOWN_ERROR:
                        errorMessage.innerText = "An unknown error occurred.";
                        // change errorMessage class to warning
                        if (errorMessage.classList.contains("error")) {
                            errorMessage.classList.remove('error');
                        }
                        if (!errorMessage.classList.contains("warning")) {
                            errorMessage.classList.add("warning");
                        }
                        errorMessage.style.display = "block";
                        break;
                }

            }
        );
    } else {
        // If geolocation is not available, display error message
        errorMessage.innerText = "Geolocation is not supported by this browser.";
        // change errorMessage class to warning
        if (errorMessage.classList.contains("error")) {
            errorMessage.classList.remove('error');
        }
        if (!errorMessage.classList.contains("warning")) {
            errorMessage.classList.add("warning");
        }
        errorMessage.style.display = "block";
    }
});
