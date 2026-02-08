document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("button-do-log-in");

  loginButton.addEventListener("click", (event) => {
    event.preventDefault(); // Sicherheitshalber
    showPhishingWarning();
  });
});

function showPhishingWarning() {
  document.getElementById("phishing-overlay").style.display = "flex";
}
