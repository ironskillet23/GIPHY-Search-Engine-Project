// -----------------------------
// GIPHY API Settings
// -----------------------------

const API_KEY = "6QXNavqpdGMKCyFdbQZUwiAqe2PRVZoD";
const BASE_URL = "https://api.giphy.com/v1/gifs";


// -----------------------------
// Get HTML Elements
// -----------------------------

const gifContainer =
    document.getElementById("gifContainer");

// -----------------------------
// Modal Elements
// -----------------------------

const gifModal = document.getElementById("gifModal");
const modalGif = document.getElementById("modalGif");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");
const copyButton = document.getElementById("copyButton");
const giphyLink = document.getElementById("giphyLink");
const copyMessage = document.getElementById("copyMessage");

// Store the selected GIF URL
let selectedGifUrl = "";


// -----------------------------
// Load Trending GIFs
// -----------------------------

async function loadTrendingGIFs() {

    // Show loading indicator
    gifContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading GIFs...</p>
        </div>
    `;


    // Create the Trending API URL
    const url =
        `${BASE_URL}/trending?api_key=${API_KEY}` +
        `&limit=20&rating=g`;


    try {

        // Request trending GIFs from GIPHY
        const response = await fetch(url);


        // Check if the API request was successful
        if (!response.ok) {

            throw new Error(
                "Could not retrieve trending GIFs."
            );

        }


        // Convert the API response to JSON
        const result = await response.json();



        // -----------------------------
        // Store, Filter, and Map Results
        // -----------------------------

        // Store the API GIF data in an array
        const gifResults = result.data;


        // filter() creates a new array containing
        // only GIFs with the required image data
        const validGIFs = gifResults.filter(function(gif) {

            return gif.images &&
                   gif.images.fixed_height &&
                   gif.images.fixed_height.url;

        });


        // map() creates a new array containing
        // only the GIF information our site needs
        const formattedGIFs = validGIFs.map(function(gif) {

            return {
                title: gif.title,
                url: gif.url,
                images: gif.images
            };

        });



        // -----------------------------
        // Check for No Results
        // -----------------------------

        if (formattedGIFs.length === 0) {

            gifContainer.innerHTML = `
                <p class="status-message">
                    No trending GIFs were found.
                </p>
            `;

            return;

        }



        // -----------------------------
        // Display Trending GIFs
        // -----------------------------

        displayGIFs(formattedGIFs);

    }

    catch (error) {

        // Show error in browser console
        console.error(error);


        // Show error message on webpage
        gifContainer.innerHTML = `
            <p class="status-message error-status">
                Unable to load trending GIFs.
                Please try again.
            </p>
        `;

    }

}

// -----------------------------
// Display GIF Cards
// -----------------------------

function displayGIFs(gifs) {

    // Remove loading message
    gifContainer.innerHTML = "";


    gifs.forEach(function(gif) {

        // Create card
        const gifCard =
            document.createElement("div");

        gifCard.classList.add("gif-card");


        // Create image
        const gifImage =
            document.createElement("img");

        gifImage.src =
            gif.images.fixed_height.url;

        gifImage.alt =
            gif.title || "GIPHY GIF";

        gifImage.classList.add("gif-image");


        // Create title
        const gifTitle =
            document.createElement("h3");

        gifTitle.textContent =
            gif.title || "Untitled GIF";


        // Add image and title to card
        gifCard.appendChild(gifImage);

        gifCard.appendChild(gifTitle);


        // Open modal when card is clicked
        gifCard.addEventListener(
            "click",
            function() {

                openModal(gif);

            }
        );


        // Add card to page
        gifContainer.appendChild(gifCard);

    });
}


// -----------------------------
// Open GIF Modal
// -----------------------------

function openModal(gif) {
    // Confirm that the modal elements exist
    if (
        !gifModal ||
        !modalGif ||
        !modalTitle ||
        !giphyLink ||
        !copyMessage
    ) {
        console.error("One or more modal HTML elements could not be found.");
        return;
    }

    // Confirm that the GIF contains an original image
    if (
        !gif.images ||
        !gif.images.original ||
        !gif.images.original.url
    ) {
        console.error("The selected GIF does not have an original image URL.");
        return;
    }

    // Display the larger GIF
    modalGif.src = gif.images.original.url;
    modalGif.alt = gif.title || "GIPHY GIF";

    // Display the GIF title
    modalTitle.textContent = gif.title || "Untitled GIF";

    // Save the direct GIF URL for the copy button
    selectedGifUrl = gif.images.original.url;

    // Set the GIPHY page link
    giphyLink.href = gif.url;

    // Clear the previous copy message
    copyMessage.textContent = "";

    // Show the modal
    gifModal.classList.add("show");

    // Prevent the page behind the modal from scrolling
    document.body.style.overflow = "hidden";
}



// -----------------------------
// Close GIF Modal
// -----------------------------

function closeModal() {
    gifModal.classList.remove("show");

    // Restore page scrolling
    document.body.style.overflow = "";
}


// Close using the X button
modalClose.addEventListener("click", closeModal);


// Close by clicking the dark background
gifModal.addEventListener("click", function (event) {
    if (event.target === gifModal) {
        closeModal();
    }
});


// Close by pressing Escape
document.addEventListener("keydown", function (event) {
    if (
        event.key === "Escape" &&
        gifModal.classList.contains("show")
    ) {
        closeModal();
    }
});


// -----------------------------
// Copy GIF URL
// -----------------------------

copyButton.addEventListener("click", async function () {
    if (selectedGifUrl === "") {
        copyMessage.textContent = "No GIF URL is available.";
        return;
    }

    try {
        await navigator.clipboard.writeText(selectedGifUrl);
        copyMessage.textContent = "GIF URL copied!";
    } catch (error) {
        console.error(error);
        copyMessage.textContent = "Unable to copy GIF URL.";
    }
});


// -----------------------------
// Load Trending GIFs
// -----------------------------

loadTrendingGIFs();