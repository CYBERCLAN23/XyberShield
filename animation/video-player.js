(function() {
    let currentPlayer = null;

    function playVideo(player, videoId) {
        if (!videoId) return;

        if (currentPlayer && currentPlayer.player !== player) {
            pauseCurrentVideo();
        }

        const overlay = player.querySelector('.video-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }

        const iframe = document.createElement('iframe');
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&modestbranding=1&rel=0&showinfo=0&playsinline=1`;

        iframe.src = embedUrl;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'absolute';
        iframe.style.top = '0';
        iframe.style.left = '0';

        player.innerHTML = '';
        player.appendChild(iframe);

        currentPlayer = {
            player: player,
            iframe: iframe,
            videoId: videoId
        };
    }

    function pauseCurrentVideo() {
        if (!currentPlayer) return;

        const player = currentPlayer.player;
        const videoId = currentPlayer.videoId;

        player.innerHTML = `
            <div class="youtube-thumbnail">
                <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="Video Thumbnail">
            </div>
            <div class="video-overlay">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        `;

        // Re-attach the click listener to the restored player
        player.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            playVideo(player, videoId);
        }, { once: true });

        currentPlayer = null;
    }

    function initVideoPlayers() {
        const videoPlayers = document.querySelectorAll('.youtube-player');
        videoPlayers.forEach(player => {
            const videoId = player.getAttribute('data-video-id');
            if (!videoId) return;

            player.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                playVideo(player, videoId);
            }, { once: true });
        });
    }

    function handleOutsideClick(e) {
        if (currentPlayer && !currentPlayer.player.contains(e.target)) {
            pauseCurrentVideo();
        }
    }

    function handleScroll() {
        if (currentPlayer) {
            pauseCurrentVideo();
        }
    }

    // Main initialization
    function initialize() {
        initVideoPlayers();
        document.addEventListener('click', handleOutsideClick);
        window.addEventListener('scroll', handleScroll, { passive: true });

        document.addEventListener('visibilitychange', function() {
            if (document.hidden && currentPlayer) {
                pauseCurrentVideo();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();