document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    if (currentPage === "index.html" && sessionStorage.getItem("welcomeShown") !== "true") {
        const welcomeDialog = document.createElement("dialog");
        welcomeDialog.setAttribute("aria-labelledby", "welcome-title");
        welcomeDialog.style.cssText =
            "width:min(82vw,360px);padding:18px;border:0;border-top:5px solid #c8102e;" +
            "background:#fff;color:#171717;text-align:center;box-shadow:0 18px 60px #0006;";

        const welcomeTitle = document.createElement("h2");
        welcomeTitle.id = "welcome-title";
        welcomeTitle.textContent = "Welcome to Vhaluvhuu Automotive Repairs";
        welcomeTitle.style.cssText = "margin:0 0 8px;color:#c8102e;font-size:1.15rem;";

        const welcomeText = document.createElement("p");
        welcomeText.textContent =
            "Reliable, professional, and trusted automotive repairs. How can we help you today?";

        const welcomeButton = document.createElement("button");
        welcomeButton.type = "button";
        welcomeButton.textContent = "Explore our services";
        welcomeButton.style.cssText =
            "padding:8px 13px;border:0;border-radius:3px;background:#c8102e;color:#fff;" +
            "font:inherit;font-size:.88rem;font-weight:700;cursor:pointer;";
        welcomeButton.addEventListener("click", function () {
            welcomeDialog.close();
        });

        welcomeDialog.append(welcomeTitle, welcomeText, welcomeButton);
        document.body.appendChild(welcomeDialog);
        welcomeDialog.addEventListener("close", function () {
            sessionStorage.setItem("welcomeShown", "true");
        });
        welcomeDialog.showModal();
        welcomeButton.focus();

        window.setTimeout(function () {
            if (welcomeDialog.open) {
                welcomeDialog.close();
            }
        }, 5000);
    }

    document.querySelectorAll("nav a").forEach(function (link) {
        const linkPage = new URL(link.href).pathname.split("/").pop();

        if (linkPage === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });

    document.querySelectorAll(".site-header nav").forEach(function (navigation) {
        const menuToggle = navigation.querySelector(".nav-toggle");
        const menuLabel = menuToggle.querySelector(".visually-hidden");
        const mobileLayout = window.matchMedia("(max-width: 768px)");

        function setMenuOpen(isOpen) {
            navigation.classList.toggle("is-open", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuLabel.textContent = isOpen ? "Close navigation menu" : "Open navigation menu";
        }

        menuToggle.addEventListener("click", function () {
            setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
        });

        navigation.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
                setMenuOpen(false);
                menuToggle.focus();
            }
        });

        navigation.querySelectorAll(".nav-links a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (mobileLayout.matches) {
                    setMenuOpen(false);
                }
            });
        });

        mobileLayout.addEventListener("change", function (event) {
            if (!event.matches) {
                setMenuOpen(false);
            }
        });
    });

    const dateTimeDisplay = document.getElementById("currentDateTime");

    if (dateTimeDisplay) {
        function updateDateTime() {
            const now = new Date();
            dateTimeDisplay.dateTime = now.toISOString();
            dateTimeDisplay.textContent = new Intl.DateTimeFormat(undefined, {
                dateStyle: "full",
                timeStyle: "medium"
            }).format(now);
        }

        updateDateTime();
        window.setInterval(updateDateTime, 1000);
    }

    const clickMeButton = document.getElementById("clickMeButton");
    const clickMeMessage = document.getElementById("clickMeMessage");

    if (clickMeButton && clickMeMessage) {
        clickMeButton.addEventListener("click", function () {
            clickMeMessage.hidden = false;
            clickMeButton.textContent = "Thanks for clicking!";
            clickMeButton.disabled = true;
        });
    }

    const bookingDate = document.getElementById("date");

    if (bookingDate) {
        function validateBookingDate() {
            const value = bookingDate.value.trim();
            bookingDate.setCustomValidity("");

            if (!value || !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                return;
            }

            const parts = value.split("/").map(Number);
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
            const selectedDate = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (
                selectedDate.getFullYear() !== year ||
                selectedDate.getMonth() !== month - 1 ||
                selectedDate.getDate() !== day
            ) {
                bookingDate.setCustomValidity("Enter a valid calendar date.");
            } else if (selectedDate < today) {
                bookingDate.setCustomValidity("Choose today or a future date.");
            }
        }

        bookingDate.addEventListener("input", validateBookingDate);
        bookingDate.addEventListener("change", validateBookingDate);
    }

    const callbackButton = document.getElementById("callback-button");
    const callbackDialog = document.getElementById("callback-dialog");
    const callbackForm = document.getElementById("callback-form");
    const callbackCancel = document.getElementById("callback-cancel");

    if (callbackButton && callbackDialog && callbackForm && callbackCancel) {
        callbackButton.addEventListener("click", function () {
            callbackDialog.showModal();
            callbackForm.querySelector('[name="name"]').focus();
        });

        callbackCancel.addEventListener("click", function () {
            callbackDialog.close();
            callbackButton.focus();
        });

        callbackForm.addEventListener("submit", function (event) {
            const name = callbackForm.querySelector('[name="name"]');
            const phone = callbackForm.querySelector('[name="phone"]');
            const details = callbackForm.querySelector('[name="details"]');
            const message = callbackForm.querySelector('[name="text"]');

            if (name.value.trim().length < 2) {
                event.preventDefault();
                name.setCustomValidity("Please enter your name.");
                name.reportValidity();
                name.setCustomValidity("");
                return;
            }

            const request = [
                "I would like to request a callback.",
                "Name: " + name.value.trim(),
                "Phone: " + phone.value.trim()
            ];

            if (details.value.trim()) {
                request.push("Callback details: " + details.value.trim());
            }

            message.value = request.join("\n");
        });
    }

    document.querySelectorAll("form").forEach(function (form) {
        if (form.id === "callback-form") {
            return;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = form.querySelector('[name="fullname"], [name="name"]');
            const message = form.querySelector('[name="message"]');

            if (name && name.value.trim().length < 2) {
                name.setCustomValidity("Please enter your full name.");
                name.reportValidity();
                name.setCustomValidity("");
                return;
            }

            if (message && message.value.trim().length < 10) {
                message.setCustomValidity("Please enter at least 10 characters.");
                message.reportValidity();
                message.setCustomValidity("");
                return;
            }

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            let feedback = form.nextElementSibling;

            if (!feedback || !feedback.classList.contains("form-feedback")) {
                feedback = document.createElement("p");
                feedback.className = "form-feedback";
                feedback.setAttribute("role", "status");
                form.insertAdjacentElement("afterend", feedback);
            }

            feedback.textContent =
                "Your information is valid, but this website is not set up to send submissions yet.";
        });

        form.addEventListener("reset", function () {
            const feedback = form.nextElementSibling;

            if (feedback && feedback.classList.contains("form-feedback")) {
                feedback.remove();
            }
        });
    });

    const lightbox = document.createElement("dialog");
    lightbox.setAttribute("aria-label", "Expanded image");
    lightbox.style.cssText =
        "max-width:90vw;max-height:90vh;padding:12px;border:0;background:#171717;color:#fff;";

    const enlargedImage = document.createElement("img");
    enlargedImage.style.cssText =
        "display:block;max-width:85vw;max-height:78vh;object-fit:contain;margin-bottom:10px;";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "Close image";
    closeButton.addEventListener("click", function () {
        lightbox.close();
    });

    lightbox.append(enlargedImage, closeButton);
    document.body.appendChild(lightbox);

    document.querySelectorAll("main img").forEach(function (image) {
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "Enlarge image: " + image.alt);
        image.style.cursor = "zoom-in";

        function openImage() {
            enlargedImage.src = image.src;
            enlargedImage.alt = image.alt;
            lightbox.showModal();
            closeButton.focus();
        }

        image.addEventListener("click", openImage);
        image.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openImage();
            }
        });
    });
});