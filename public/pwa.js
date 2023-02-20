let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    document.querySelectorAll('.pwaAppInstallBtn').forEach(el => {
        el.style.display = "initial";
    })
    deferredPrompt = e;
});

window.addEventListener('load', () => {
    const pwaAppInstallBtn = document.querySelectorAll('.pwaAppInstallBtn');
    pwaAppInstallBtn.forEach(el => {
        el.addEventListener('click', async () => {
            if (deferredPrompt !== null) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    deferredPrompt = null;
                }
            }else{
                console.log("deferred prompt is null [Website cannot be installed]")
            }
        });
    })
})

