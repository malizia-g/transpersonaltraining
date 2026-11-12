// Resources page — YouTube "Watch" popup.
// Clicking a Watch button opens the video in a centered modal (native <dialog>,
// the same pattern as the site's privacy modal). The iframe is created only on
// open and cleared on close, so nothing loads from YouTube until the user asks
// for it, and playback stops when the popup is closed.

(function () {
    function dialog() { return document.getElementById('resource-video-modal'); }
    function frame() { return document.getElementById('rv-iframe'); }

    window.openResourceVideo = function (id) {
        const dlg = dialog();
        const f = frame();
        if (!dlg || !f || !id) return;
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
        if (typeof dlg.showModal === 'function') dlg.showModal();
        else dlg.setAttribute('open', '');
    };

    window.closeResourceVideo = function () {
        const dlg = dialog();
        const f = frame();
        if (f) f.src = 'about:blank';                 // stop playback
        if (dlg && dlg.open) {
            if (typeof dlg.close === 'function') dlg.close();
            else dlg.removeAttribute('open');
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const dlg = dialog();
        if (!dlg) return;
        // Click on the backdrop (outside the video) closes the popup.
        dlg.addEventListener('click', function (e) {
            if (e.target === dlg) window.closeResourceVideo();
        });
        // Esc key fires the dialog 'cancel' event — clear the iframe there too.
        dlg.addEventListener('cancel', function () {
            const f = frame();
            if (f) f.src = 'about:blank';
        });
    });
})();
