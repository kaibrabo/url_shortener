const form = document.getElementById("shorten-form");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");
const API_URL = window.location?.origin; // Replace with backend URL

if (!window.location?.origin) {
    console.error("");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.textContent = "";
    resultDiv.innerHTML = "";

    const urlInput = document.getElementById("url-input").value;
    try {
        const response = await fetch(`${API_URL}/shorten`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: urlInput, origin: API_URL }),
        });

        if (!response.ok) {
            throw new Error("Failed to shorten the URL");
        }

        const data = await response.json();
        resultDiv.innerHTML = `
          <p>Shortened URL:</p>
          <a href="${data.originalUrl}" target="_blank">${data.shortUrl}</a>
        `;
    } catch (error) {
        errorDiv.textContent = error.message;
    }
});

console.log("UI Loaded");