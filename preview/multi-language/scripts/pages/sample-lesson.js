// Sample lesson page — click-to-load YouTube facade.
//
// The poster image and a play button stand in for the player until the visitor
// actually asks for the video. Nothing is fetched from YouTube before that
// click: the facade is this page's largest paint, and an eager iframe would put
// the player's payload in front of it.
//
// Sibling of scripts/pages/resources.js, which does the same thing in a modal.
// Here the video is the page's subject, so it plays in place instead.

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('lesson-play');
        if (!btn) return;                       // no recording selected yet

        btn.addEventListener('click', function () {
            const id = btn.dataset.ytid;
            const host = document.getElementById('lesson-player');
            if (!id || !host) return;

            const iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
            iframe.className = 'absolute inset-0 w-full h-full block';
            iframe.title = btn.getAttribute('aria-label') || 'Sample lesson';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
            iframe.setAttribute('allowfullscreen', '');

            host.replaceChildren(iframe);
        });
    });
})();
