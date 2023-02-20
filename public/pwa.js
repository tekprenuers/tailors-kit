let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
});

window.addEventListener('load', () => {
    const pwaAppInstallBtn = document.querySelectorAll('.pwaAppInstallBtn');
    pwaAppInstallBtn.forEach(el => {
        if (deferredPrompt === null) {
            //hide the button
            el.style.display = "none";
        } else {
            el.addEventListener('click', async () => {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    deferredPrompt = null;
                }
            });
        }
    })
})

