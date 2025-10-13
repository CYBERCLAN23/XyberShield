/**
 * XyberShield Custom Video Player
 * Professional video player with cybersecurity-themed design
 */
class XyberVideoPlayer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoplay: options.autoplay || false,
            controls: options.controls !== false,
            volume: options.volume || 1,
            title: options.title || '',
            ...options
        };
        
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = this.options.volume;
        this.isMuted = false;
        this.isFullscreen = false;
        
        this.init();
    }
    
    init() {
        this.createPlayerHTML();
        this.bindEvents();
        this.setupKeyboardControls();
    }
    
    createPlayerHTML() {
        this.container.innerHTML = `
            <div class="xyber-video-player xyber-fade-in">
                <div class="xyber-video-container">
                    <video class="xyber-video-element" preload="metadata" style="display: none;">
                        <source src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    
                    <div class="xyber-youtube-container" style="display: none;">
                        <div id="xyber-youtube-player" style="width: 100%; height: 100%;"></div>
                    </div>
                    
                    <div class="xyber-video-overlay"></div>
                    
                    <div class="xyber-video-title">${this.options.title}</div>
                    
                    <div class="xyber-loading-spinner" style="display: none;">
                        <div class="xyber-spinner"></div>
                    </div>
                    
                    <div class="xyber-play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                    
                    <div class="xyber-video-error" style="display: none;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h4>Video Error</h4>
                        <p>Unable to load video. Please try again.</p>
                    </div>
                    
                    <div class="xyber-video-controls">
                        <div class="xyber-progress-container">
                            <div class="xyber-progress-bar"></div>
                        </div>
                        
                        <div class="xyber-controls-row">
                            <div class="xyber-controls-left">
                                <button class="xyber-control-btn play-pause">
                                    <i class="fas fa-play"></i>
                                </button>
                                
                                <div class="xyber-volume-container">
                                    <button class="xyber-control-btn volume-btn">
                                        <i class="fas fa-volume-up"></i>
                                    </button>
                                    <div class="xyber-volume-slider">
                                        <div class="xyber-volume-progress"></div>
                                    </div>
                                </div>
                                
                                <div class="xyber-time-display">
                                    <span class="current-time">0:00</span> / <span class="duration">0:00</span>
                                </div>
                            </div>
                            
                            <div class="xyber-controls-right">
                                <button class="xyber-control-btn settings-btn">
                                    <i class="fas fa-cog"></i>
                                </button>
                                
                                <button class="xyber-fullscreen-btn">
                                    <i class="fas fa-expand"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Get references to elements
        this.playerElement = this.container.querySelector('.xyber-video-player');
        this.videoElement = this.container.querySelector('.xyber-video-element');
        this.youtubeContainer = this.container.querySelector('.xyber-youtube-container');
        this.playOverlay = this.container.querySelector('.xyber-play-overlay');
        this.loadingSpinner = this.container.querySelector('.xyber-loading-spinner');
        this.errorDisplay = this.container.querySelector('.xyber-video-error');
        this.controls = this.container.querySelector('.xyber-video-controls');
        this.playPauseBtn = this.container.querySelector('.play-pause');
        this.progressContainer = this.container.querySelector('.xyber-progress-container');
        this.progressBar = this.container.querySelector('.xyber-progress-bar');
        this.volumeBtn = this.container.querySelector('.volume-btn');
        this.volumeSlider = this.container.querySelector('.xyber-volume-slider');
        this.volumeProgress = this.container.querySelector('.xyber-volume-progress');
        this.currentTimeDisplay = this.container.querySelector('.current-time');
        this.durationDisplay = this.container.querySelector('.duration');
        this.fullscreenBtn = this.container.querySelector('.xyber-fullscreen-btn');
    }
    
    bindEvents() {
        // Play/Pause
        this.playOverlay.addEventListener('click', () => this.togglePlay());
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        
        // Video events
        this.videoElement.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
        this.videoElement.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.videoElement.addEventListener('ended', () => this.onEnded());
        this.videoElement.addEventListener('play', () => this.onPlay());
        this.videoElement.addEventListener('pause', () => this.onPause());
        this.videoElement.addEventListener('error', () => this.onError());
        this.videoElement.addEventListener('loadstart', () => this.showLoading());
        this.videoElement.addEventListener('canplay', () => this.hideLoading());
        
        // Progress bar
        this.progressContainer.addEventListener('click', (e) => this.seek(e));
        
        // Volume controls
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('click', (e) => this.setVolume(e));
        
        // Fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Show/hide controls
        this.playerElement.addEventListener('mouseenter', () => this.showControls());
        this.playerElement.addEventListener('mouseleave', () => this.hideControls());
        this.playerElement.addEventListener('mousemove', () => this.showControls());
        
        // Double click for fullscreen
        this.videoElement.addEventListener('dblclick', () => this.toggleFullscreen());
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.playerElement.matches(':hover')) return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.seek(null, this.currentTime - 10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.seek(null, this.currentTime + 10);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.setVolume(null, Math.min(this.volume + 0.1, 1));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.setVolume(null, Math.max(this.volume - 0.1, 0));
                    break;
                case 'KeyM':
                    e.preventDefault();
                    this.toggleMute();
                    break;
                case 'KeyF':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
    }
    
    loadVideo(src, title = '') {
        this.hideError();
        this.showLoading();
        
        // Update title
        if (title) {
            this.container.querySelector('.xyber-video-title').textContent = title;
        }
        
        // Check if it's a YouTube URL
        const youtubeMatch = src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\/\s]{11})/i);
        
        if (youtubeMatch) {
            this.loadYouTubeVideo(youtubeMatch[1], title);
        } else {
            this.loadRegularVideo(src);
        }
    }
    
    async loadYouTubeVideo(videoId, title) {
        try {
            // Hide regular video, show YouTube container
            this.videoElement.style.display = 'none';
            this.youtubeContainer.style.display = 'block';
            this.youtubeContainer.style.visibility = 'visible';
            this.youtubeContainer.style.opacity = '1';
            
            // Load YouTube API if not loaded
            await this.loadYouTubeAPI();
            
            // Create YouTube player with explicit dimensions
            this.youtubePlayer = new YT.Player('xyber-youtube-player', {
                height: 480,
                width: 854,
                videoId: videoId,
                playerVars: {
                    'autoplay': this.options.autoplay ? 1 : 0,
                    'controls': 1,
                    'rel': 0,
                    'showinfo': 0,
                    'modestbranding': 1,
                    'playsinline': 1,
                    'enablejsapi': 1,
                    'origin': 'http://localhost:8000',
                    'iv_load_policy': 3,
                    'fs': 1
                },
                events: {
                    'onReady': (event) => {
                        console.log('YouTube player ready');
                        // Force the iframe to be visible
                        const iframe = document.querySelector('#xyber-youtube-player iframe');
                        if (iframe) {
                            iframe.style.display = 'block';
                            iframe.style.visibility = 'visible';
                            iframe.style.opacity = '1';
                            iframe.style.width = '100%';
                            iframe.style.height = '100%';
                        }
                        this.hideLoading();
                        this.hidePlayOverlay();
                        this.duration = this.youtubePlayer.getDuration();
                        this.updateDurationDisplay();
                        // Auto-play if enabled
                        if (this.options.autoplay) {
                            event.target.playVideo();
                        }
                    },
                    'onStateChange': (event) => {
                        if (event.data === YT.PlayerState.PLAYING) {
                            this.isPlaying = true;
                            this.updatePlayButton();
                            this.hidePlayOverlay();
                            this.startTimeUpdates();
                        } else if (event.data === YT.PlayerState.PAUSED) {
                            this.isPlaying = false;
                            this.updatePlayButton();
                            this.showPlayOverlay();
                            this.stopTimeUpdates();
                        }
                    },
                    'onError': (event) => {
                        console.error('YouTube player error:', event.data);
                        this.onError();
                    }
                }
            });
            
        } catch (error) {
            console.error('Error loading YouTube video:', error);
            this.onError();
        }
    }
    
    loadRegularVideo(src) {
        // Show regular video, hide YouTube container
        this.videoElement.style.display = 'block';
        this.youtubeContainer.style.display = 'none';
        
        this.videoElement.src = src;
        this.videoElement.load();
    }
    
    loadYouTubeAPI() {
        return new Promise((resolve, reject) => {
            if (window.YT && window.YT.Player) {
                resolve();
                return;
            }
            
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            
            window.onYouTubeIframeAPIReady = () => resolve();
            tag.onerror = () => reject(new Error('Failed to load YouTube API'));
            
            document.head.appendChild(tag);
        });
    }
    
    togglePlay() {
        if (this.youtubePlayer) {
            if (this.isPlaying) {
                this.youtubePlayer.pauseVideo();
            } else {
                this.youtubePlayer.playVideo();
            }
        } else {
            if (this.isPlaying) {
                this.videoElement.pause();
            } else {
                this.videoElement.play();
            }
        }
    }
    
    seek(event, time) {
        let seekTime;
        
        if (time !== undefined) {
            seekTime = time;
        } else {
            const rect = this.progressContainer.getBoundingClientRect();
            const percent = (event.clientX - rect.left) / rect.width;
            seekTime = percent * this.duration;
        }
        
        if (this.youtubePlayer) {
            this.youtubePlayer.seekTo(seekTime);
        } else {
            this.videoElement.currentTime = seekTime;
        }
    }
    
    setVolume(event, volume) {
        let newVolume;
        
        if (volume !== undefined) {
            newVolume = volume;
        } else {
            const rect = this.volumeSlider.getBoundingClientRect();
            newVolume = (event.clientX - rect.left) / rect.width;
        }
        
        newVolume = Math.max(0, Math.min(1, newVolume));
        this.volume = newVolume;
        
        if (this.youtubePlayer) {
            this.youtubePlayer.setVolume(newVolume * 100);
        } else {
            this.videoElement.volume = newVolume;
        }
        
        this.updateVolumeDisplay();
        this.isMuted = newVolume === 0;
        this.updateVolumeButton();
    }
    
    toggleMute() {
        if (this.isMuted) {
            this.setVolume(null, this.volume || 0.5);
            this.isMuted = false;
        } else {
            this.setVolume(null, 0);
            this.isMuted = true;
        }
    }
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            if (this.playerElement.requestFullscreen) {
                this.playerElement.requestFullscreen();
            } else if (this.playerElement.webkitRequestFullscreen) {
                this.playerElement.webkitRequestFullscreen();
            } else if (this.playerElement.msRequestFullscreen) {
                this.playerElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    // Event handlers
    onLoadedMetadata() {
        this.duration = this.videoElement.duration;
        this.updateDurationDisplay();
        this.hideLoading();
    }
    
    onTimeUpdate() {
        if (this.youtubePlayer) {
            this.currentTime = this.youtubePlayer.getCurrentTime();
        } else {
            this.currentTime = this.videoElement.currentTime;
        }
        this.updateProgress();
        this.updateTimeDisplay();
    }
    
    onPlay() {
        this.isPlaying = true;
        this.updatePlayButton();
        this.hidePlayOverlay();
    }
    
    onPause() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.showPlayOverlay();
    }
    
    onEnded() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.showPlayOverlay();
    }
    
    onError() {
        this.hideLoading();
        this.showError();
    }
    
    // UI Updates
    updatePlayButton() {
        const icon = this.playPauseBtn.querySelector('i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
    
    updateProgress() {
        const percent = (this.currentTime / this.duration) * 100;
        this.progressBar.style.width = `${percent}%`;
    }
    
    updateTimeDisplay() {
        this.currentTimeDisplay.textContent = this.formatTime(this.currentTime);
    }
    
    updateDurationDisplay() {
        this.durationDisplay.textContent = this.formatTime(this.duration);
    }
    
    updateVolumeDisplay() {
        const percent = this.volume * 100;
        this.volumeProgress.style.width = `${percent}%`;
    }
    
    updateVolumeButton() {
        const icon = this.volumeBtn.querySelector('i');
        if (this.isMuted || this.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (this.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Control visibility
    showControls() {
        this.controls.classList.add('show');
        this.clearControlsTimeout();
        this.controlsTimeout = setTimeout(() => this.hideControls(), 3000);
    }
    
    hideControls() {
        if (!this.isPlaying) return;
        this.controls.classList.remove('show');
        this.clearControlsTimeout();
    }
    
    clearControlsTimeout() {
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
            this.controlsTimeout = null;
        }
    }
    
    showPlayOverlay() {
        this.playOverlay.style.display = 'flex';
    }
    
    hidePlayOverlay() {
        this.playOverlay.style.display = 'none';
    }
    
    showLoading() {
        this.loadingSpinner.style.display = 'block';
    }
    
    hideLoading() {
        this.loadingSpinner.style.display = 'none';
    }
    
    showError() {
        this.errorDisplay.style.display = 'block';
    }
    
    hideError() {
        this.errorDisplay.style.display = 'none';
    }
    
    startTimeUpdates() {
        this.timeUpdateInterval = setInterval(() => {
            if (this.youtubePlayer && this.isPlaying) {
                this.onTimeUpdate();
            }
        }, 100);
    }
    
    stopTimeUpdates() {
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
    }
    
    // Public API
    play() {
        this.togglePlay();
    }
    
    pause() {
        if (this.isPlaying) {
            this.togglePlay();
        }
    }
    
    destroy() {
        this.stopTimeUpdates();
        this.clearControlsTimeout();
        if (this.youtubePlayer) {
            this.youtubePlayer.destroy();
        }
    }
}
