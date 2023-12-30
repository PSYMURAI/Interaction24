function openImagePopup(imageSrc) {
    // Create the overlay and pop-up elements
    var overlay = document.createElement("div");
    overlay.id = "image-overlay";
    overlay.style.display = "none";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.cursor = "pointer";
    overlay.onclick = closeImagePopup;

    var popup = document.createElement("div");
    popup.id = "image-popup";
    popup.style.backgroundColor = "#fff";
    popup.style.padding = "20px";
    popup.style.borderRadius = "5px";
    popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.6)";
    popup.style.position = "relative";

    var closeBtn = document.createElement("span");
    closeBtn.innerHTML = "X";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = closeImagePopup;

    var image = document.createElement("img");
    image.src = imageSrc;
    image.style.maxWidth = "500px";
    image.style.maxHeight = "500px";

    // Append elements to the DOM
    popup.appendChild(closeBtn);
    popup.appendChild(image);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Show the overlay and pop-up
    overlay.style.display = "flex";
    popup.style.display = "block";
}

function closeImagePopup() {
    // Remove the overlay and pop-up from the DOM
    var overlay = document.getElementById("image-overlay");
    if (overlay) {
        overlay.parentNode.removeChild(overlay);
    }
}