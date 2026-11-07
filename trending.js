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


// Modal Elements

const gifModal =
    document.getElementById("gifModal");

const modalGif =
    document.getElementById("modalGif");

const modalTitle =
    document.getElementById("modalTitle");

const modalClose =
    document.getElementById("modalClose");

const copyButton =
    document.getElementById("copyButton");

const giphyLink =
    document.getElementById("giphyLink");

const copyMessage =
    document.getElementById("copyMessage");


// Store selected GIF URL

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
// Open GIF Details Modal
// -----------------------------

function openModal(gif) {

    // Larger GIF preview
    modalGif.src =
        gif.images.original.url;

    modalGif.alt =
        gif.title || "GIPHY GIF";


    // GIF title
    modalTitle.textContent =
        gif.title || "Untitled GIF";


    // URL used by Copy button
    selectedGifUrl =
        gif.images.original.url;


    // Link to GIPHY
    giphyLink.href =
        gif.url;


    // Clear previous copy message
    copyMessage.textContent = "";


    // Display modal
    gifModal.classList.add("show");
}


// -----------------------------
// Close Modal
// -----------------------------

function closeModal() {

    gifModal.classList.remove("show");

}


// Close with X button

modalClose.addEventListener(
    "click",
    closeModal
);


// Close when clicking outside modal

gifModal.addEventListener(
    "click",
    function(event) {

        if (event.target === gifModal) {

            closeModal();

        }

    }
);


// Close with Escape key

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);


// -----------------------------
// Copy GIF URL
// -----------------------------

copyButton.addEventListener(
    "click",
    async function() {

        try {

            await navigator.clipboard.writeText(
                selectedGifUrl
            );

            copyMessage.textContent =
                "GIF URL copied!";

        }

        catch (error) {

            console.error(error);

            copyMessage.textContent =
                "Unable to copy GIF URL.";

        }

    }
);


// -----------------------------
// Load Trending GIFs
// -----------------------------

loadTrendingGIFs();