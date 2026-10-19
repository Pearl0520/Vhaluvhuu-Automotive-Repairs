document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(function (link) {
        const linkPage = new URL(link.href).pathname.split("/").pop();

        if (linkPage === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });

    const bookingDate = document.getElementById("date");

    if (bookingDate) {
        const now = new Date();
        const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);

        bookingDate.min = today;
    }

    document.querySelectorAll("form").forEach(function (form) {
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
    });

    const lightbox = document.createElement("dialog");
    lightbox.setAttribute("aria-label", "Expanded image");
    lightbox.style.cssText =
        "max-width:90vw;max-height:90vh;padding:12px;border:0;" +
        "background:#171717;color:#fff;";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "Close image";
    closeButton.addEventListener("click", function () {
        lightbox.close();
    });

    const expandedImage = document.createElement("img");
    expandedImage.style.cssText =
        "display:block;max-width:85vw;max-height:78vh;object-fit:contain;margin-bottom:10px;";

    lightbox.append(expandedImage, closeButton);
    document.body.appendChild(lightbox);

    document.querySelectorAll("main img").forEach(function (image) {
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "Enlarge image: " + image.alt);
        image.style.cursor = "zoom-in";

        function openImage() {
            expandedImage.src = image.src;
            expandedImage.alt = image.alt;
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

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const target = document.getElementById(link.hash.slice(1));

            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
});