let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
});

window.addEventListener('load', () => {
    const pwaAppInstallBtn = document.querySelectorAll('.pwaAppInstallBtn');
    console.log(pwaAppInstallBtn)
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

