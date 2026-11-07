// -----------------------------
// Get HTML Elements
// -----------------------------

const contactForm =
    document.getElementById("contactForm");

const fullName =
    document.getElementById("fullName");

const email =
    document.getElementById("email");

const message =
    document.getElementById("message");


// Error Messages

const nameError =
    document.getElementById("nameError");

const emailError =
    document.getElementById("emailError");

const messageError =
    document.getElementById("messageError");

const successMessage =
    document.getElementById("successMessage");


// -----------------------------
// Form Submit Event
// -----------------------------

contactForm.addEventListener(
    "submit",
    function(event) {

        // Prevent the form from submitting
        event.preventDefault();


        // Clear old messages
        clearMessages();


        // Track whether the form is valid
        let isValid = true;


        // -----------------------------
        // Validate Name
        // -----------------------------

        if (fullName.value.trim() === "") {

            nameError.textContent =
                "Please enter your full name.";

            isValid = false;
        }


        // -----------------------------
        // Validate Email
        // -----------------------------

        if (email.value.trim() === "") {

            emailError.textContent =
                "Please enter your email address.";

            isValid = false;

        }

        else if (!isValidEmail(email.value.trim())) {

            emailError.textContent =
                "Please enter a valid email address.";

            isValid = false;
        }


        // -----------------------------
        // Validate Message
        // -----------------------------

        if (message.value.trim() === "") {

            messageError.textContent =
                "Please enter a message.";

            isValid = false;
        }


        // -----------------------------
        // Successful Form
        // -----------------------------

        if (isValid) {

            successMessage.textContent =
                "Thank you! Your message has been submitted successfully.";

            // Clear the form
            contactForm.reset();
        }

    }
);


// -----------------------------
// Email Validation Function
// -----------------------------

function isValidEmail(emailAddress) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(emailAddress);
}


// -----------------------------
// Clear Messages
// -----------------------------

function clearMessages() {

    nameError.textContent = "";

    emailError.textContent = "";

    messageError.textContent = "";

    successMessage.textContent = "";

}