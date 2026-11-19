// Keep the displayed year current while retaining 2026 in a no-JavaScript fallback.
document.getElementById("year").textContent = String(new Date().getFullYear());



// Register the service worker so the site can be installed as a web app.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}

// Show Chrome/Edge's native install prompt when the browser makes it available.
let deferredInstallPrompt = null;
const installButton = document.getElementById("installApp");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installButton) installButton.hidden = false;
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  if (installButton) {
    installButton.textContent = "App installed";
    installButton.disabled = true;
  }
});

if (installButton) {
  installButton.addEventListener("click", async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      return;
    }

    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      installButton.textContent = "App installed";
      installButton.disabled = true;
      return;
    }

    alert(`To install Deep Blue Monkey in Chrome or Edge:

1. Open the browser menu (⋮) at the top-right.
2. Choose "Install Deep Blue Monkey" or "Apps" → "Install this site as an app".
3. Confirm Install.`);
  });
}
