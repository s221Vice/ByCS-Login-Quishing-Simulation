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

document.addEventListener("DOMContentLoaded", () => {
    // 1. Variablen definieren
    const loginButton = document.getElementById("button-do-log-in"); // Der Button der Login-Seite
    const overlay = document.getElementById("phishing-overlay");      // Das versteckte Fenster
    const downloadBtn = document.getElementById("force-download-btn"); // Der Button im Fenster
    
    // Name deines PDFs (muss im selben Hauptordner auf GitHub liegen!)
    const pdfFileName = "quishing-arbeitsblatt.pdf"; 

    // 2. Klick auf den Login-Button abfangen
    if (loginButton) {
        loginButton.addEventListener("click", (event) => {
            event.preventDefault(); // Verhindert, dass die Seite wirklich etwas abschickt
            overlay.style.display = "flex"; // Zeigt das Warn-Fenster an
        });
    }

    // 3. Klick auf den Download-Button im Fenster
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            console.log("Download wird gestartet...");
            forceDownload(pdfFileName, "Arbeitsblatt_Quishing.pdf");
        });
    }
});

// Die Funktion, die den Browser zum Herunterladen zwingt
function forceDownload(url, filename) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Datei nicht gefunden');
            return response.blob();
        })
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Fehler:', error);
            alert("Das Arbeitsblatt konnte nicht geladen werden. Prüfe, ob die PDF-Datei richtig im GitHub-Ordner liegt.");
        });
}
