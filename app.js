// -----------------------------
// GIPHY API Settings
// -----------------------------

const API_KEY = "6QXNavqpdGMKCyFdbQZUwiAqe2PRVZoD";

const BASE_URL = "https://api.giphy.com/v1/gifs";


// -----------------------------
// Get HTML Elements
// -----------------------------

const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const gifContainer = document.getElementById("gifContainer");

const trendingHeading = document.querySelector(".trending h2");

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
// Search Button Event
// -----------------------------

searchButton.addEventListener("click", function() {

    const searchTerm = searchInput.value.trim();

    // Prevent an empty search
    if (searchTerm === "") {
        alert("Please enter something to search for.");
        return;
    }

    searchGIFs(searchTerm);

});


// -----------------------------
// Enter Key Event
// -----------------------------

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        const searchTerm = searchInput.value.trim();

        // Prevent an empty search
        if (searchTerm === "") {
            alert("Please enter something to search for.");
            return;
        }

        searchGIFs(searchTerm);
    }

});


async function searchGIFs(searchTerm) {

    // Change section heading
    trendingHeading.textContent =
        `Search Results for "${searchTerm}"`;


    // Replace existing GIFs with loading message
    gifContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading GIFs...</p>
        </div>
    `;


    // Create the search API URL
    const url =
        `${BASE_URL}/search?api_key=${API_KEY}` +
        `&q=${encodeURIComponent(searchTerm)}` +
        `&limit=20&rating=g`;


    try {

        // Request GIFs from GIPHY
        const response = await fetch(url);


        // Check if request was successful
        if (!response.ok) {

            throw new Error("Could not retrieve GIFs.");

        }


        // Convert response to JSON
        const result = await response.json();



        // -----------------------------
        // Store, Filter, and Map Results
        // -----------------------------

        // Store GIF results in an array
        const gifResults = result.data;


        // filter() removes GIFs that do not
        // have the image information we need
        const validGIFs = gifResults.filter(function(gif) {

            return gif.images &&
                   gif.images.fixed_height &&
                   gif.images.fixed_height.url;

        });


        // map() creates a new array containing
        // only the information our website needs
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
                    No GIFs found. Try another search.
                </p>
            `;

            return;
        }



        // -----------------------------
        // Display Matching GIFs
        // -----------------------------

        displayGIFs(formattedGIFs);

    }

    catch (error) {

        console.error(error);

        gifContainer.innerHTML = `
            <p class="status-message error-status">
                Unable to load GIFs. Please try again.
            </p>
        `;

    }
}

// -----------------------------
// Display GIFs
// -----------------------------

function displayGIFs(gifs) {

    // Clear previous GIFs
    gifContainer.innerHTML = "";

    // Check for no results
    if (gifs.length === 0) {

        gifContainer.innerHTML =
            "<p>No GIFs found.</p>";

        return;
    }


    // Loop through GIF array
    gifs.forEach(function(gif) {

        // Create GIF card
        const gifCard = document.createElement("div");

        gifCard.classList.add("gif-card");


        // Create GIF image
        const gifImage = document.createElement("img");

        gifImage.src = gif.images.fixed_height.url;

        gifImage.alt =
            gif.title || "GIPHY GIF";

        gifImage.classList.add("gif-image");


        // Create GIF title
        const gifTitle = document.createElement("h3");

        gifTitle.textContent =
            gif.title || "Untitled GIF";


        // Add image to card
        gifCard.appendChild(gifImage);

        // Add title to card
        gifCard.appendChild(gifTitle);


        // Open modal when card is clicked
        gifCard.addEventListener("click", function() {

            openModal(gif);

        });


        // Add card to container
        gifContainer.appendChild(gifCard);

    });
}

// -----------------------------
// Open GIF Modal
// -----------------------------

function openModal(gif) {

    // Display larger GIF
    modalGif.src = gif.images.original.url;

    modalGif.alt =
        gif.title || "GIPHY GIF";


    // Display GIF title
    modalTitle.textContent =
        gif.title || "Untitled GIF";


    // Save direct GIF URL for copy button
    selectedGifUrl =
        gif.images.original.url;


    // Set GIPHY link
    giphyLink.href = gif.url;


    // Clear old copy message
    copyMessage.textContent = "";


    // Show modal
    gifModal.classList.add("show");
}

// -----------------------------
// Close Modal
// -----------------------------

function closeModal() {

    gifModal.classList.remove("show");

}


// Close using X button
modalClose.addEventListener("click", closeModal);

gifModal.addEventListener("click", function(event) {

    if (event.target === gifModal) {

        closeModal();

    }

});

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeModal();

    }

});

// -----------------------------
// Copy GIF URL
// -----------------------------

copyButton.addEventListener("click", async function() {

    try {

        await navigator.clipboard.writeText(selectedGifUrl);

        copyMessage.textContent =
            "GIF URL copied!";

    } catch (error) {

        console.error(error);

        copyMessage.textContent =
            "Unable to copy GIF URL.";

    }

});

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


// Load trending GIFs when the page opens
loadTrendingGIFs();