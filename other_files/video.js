/**
 * Video Background Controller
 * Manages random playback and smooth fade transitions between background videos
 */

class VideoBackgroundController {
    constructor() {
        this.videos = [
            'https://mytech.today/wp-content/uploads/2025/05/2010-cinematic-bg-01.mp4',
            'https://mytech.today/wp-content/uploads/2025/05/2010-cinematic-bg-02.mp4',
            'https://mytech.today/wp-content/uploads/2025/06/2010-Cinematic-Bg-04.mp4'
        ];
        
        this.videoElements = [];
        this.currentVideoIndex = 0;
        this.isTransitioning = false;
        this.fadeDuration = 2000; // 2 seconds fade duration
        
        this.init();
    }
    
    init() {
        this.setupVideoElements();
        this.setupEventListeners();
        this.startRandomPlayback();
    }
    
    setupVideoElements() {
        const video1 = document.getElementById('downtown_videos_1');
        const video2 = document.getElementById('downtown_videos_2');

        if (!video1 || !video2) {
            console.error('Video elements not found');
            return;
        }

        this.videoElements = [video1, video2];

        // Set initial styles for fade transitions - work with existing CSS
        this.videoElements.forEach((video, index) => {
            // Don't override existing positioning - let CSS handle it
            // Just add transition and opacity for fade effects
            video.style.transition = `opacity ${this.fadeDuration}ms ease-in-out`;
            video.style.opacity = index === 0 ? '0.3' : '0'; // Use existing opacity value
            video.style.zIndex = index === 0 ? '2' : '1';
        });

        // Load first video
        this.loadVideo(0, this.getRandomVideoSrc());
    }
    
    setupEventListeners() {
        this.videoElements.forEach((video, index) => {
            video.addEventListener('ended', () => {
                if (!this.isTransitioning) {
                    this.transitionToNextVideo();
                }
            });
            
            video.addEventListener('error', (e) => {
                console.error(`Video ${index + 1} error:`, e);
                // Try to recover by transitioning to next video
                setTimeout(() => {
                    if (!this.isTransitioning) {
                        this.transitionToNextVideo();
                    }
                }, 1000);
            });
            
            video.addEventListener('loadeddata', () => {
                console.log(`Video ${index + 1} loaded successfully`);
            });
        });
    }
    
    getRandomVideoSrc() {
        const randomIndex = Math.floor(Math.random() * this.videos.length);
        return this.videos[randomIndex];
    }
    
    loadVideo(videoElementIndex, src) {
        const video = this.videoElements[videoElementIndex];
        if (video) {
            video.src = src;
            video.load();
        }
    }
    
    async transitionToNextVideo() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        const currentVideo = this.videoElements[this.currentVideoIndex];
        const nextVideoIndex = this.currentVideoIndex === 0 ? 1 : 0;
        const nextVideo = this.videoElements[nextVideoIndex];
        
        // Load random video into the next video element
        const randomSrc = this.getRandomVideoSrc();
        this.loadVideo(nextVideoIndex, randomSrc);
        
        // Wait for the video to be ready
        await this.waitForVideoReady(nextVideo);
        
        // Start playing the next video
        try {
            await nextVideo.play();
        } catch (error) {
            console.error('Error playing next video:', error);
            this.isTransitioning = false;
            return;
        }
        
        // Perform fade transition
        this.performFadeTransition(currentVideo, nextVideo);
        
        // Update current video index
        this.currentVideoIndex = nextVideoIndex;
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, this.fadeDuration);
    }
    
    waitForVideoReady(video) {
        return new Promise((resolve) => {
            if (video.readyState >= 3) { // HAVE_FUTURE_DATA
                resolve();
            } else {
                const onCanPlay = () => {
                    video.removeEventListener('canplay', onCanPlay);
                    resolve();
                };
                video.addEventListener('canplay', onCanPlay);
            }
        });
    }
    
    performFadeTransition(currentVideo, nextVideo) {
        // Set z-index for proper layering
        currentVideo.style.zIndex = '1';
        nextVideo.style.zIndex = '2';

        // Start fade transition - use the existing CSS opacity value (0.3)
        nextVideo.style.opacity = '0.3';
        currentVideo.style.opacity = '0';

        // Pause and reset current video after fade completes
        setTimeout(() => {
            currentVideo.pause();
            currentVideo.currentTime = 0;
        }, this.fadeDuration);
    }
    
    async startRandomPlayback() {
        const firstVideo = this.videoElements[0];
        if (firstVideo) {
            try {
                await firstVideo.play();
                console.log('Video playback started');
            } catch (error) {
                console.error('Error starting video playback:', error);
                // Handle autoplay restrictions
                this.handleAutoplayRestriction();
            }
        }
    }
    
    handleAutoplayRestriction() {
        // Create a user interaction handler for autoplay restrictions
        const startPlayback = async () => {
            try {
                await this.videoElements[this.currentVideoIndex].play();
                document.removeEventListener('click', startPlayback);
                document.removeEventListener('touchstart', startPlayback);
                document.removeEventListener('keydown', startPlayback);
            } catch (error) {
                console.error('Still unable to play video:', error);
            }
        };
        
        document.addEventListener('click', startPlayback);
        document.addEventListener('touchstart', startPlayback);
        document.addEventListener('keydown', startPlayback);
        
        console.log('Video autoplay blocked. Click anywhere to start playback.');
    }
    
    // Public methods for external control
    pause() {
        this.videoElements.forEach(video => video.pause());
    }
    
    resume() {
        const currentVideo = this.videoElements[this.currentVideoIndex];
        if (currentVideo) {
            currentVideo.play().catch(error => {
                console.error('Error resuming video:', error);
            });
        }
    }
    
    setFadeDuration(duration) {
        this.fadeDuration = duration;
        this.videoElements.forEach(video => {
            video.style.transition = `opacity ${this.fadeDuration}ms ease-in-out`;
        });
    }
}

// Initialize the video background controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if video elements exist before initializing
    const videoContainer = document.getElementById('downtown_videos');
    if (videoContainer) {
        window.videoController = new VideoBackgroundController();
    } else {
        console.warn('Video container not found. Video background controller not initialized.');
    }
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoBackgroundController;
}
