// Fairytale Picturebook Pro - Script

let currentPage = 0;
const totalPages = document.querySelectorAll('.page').length;
let autoPlayEnabled = false;

// DOM elements
const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentPageSpan = document.getElementById('current-page');
const autoPlayBtn = document.getElementById('auto-play-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Initialize
function init() {
    const totalPageSpan = document.getElementById('total-pages');
    if (totalPageSpan) {
        totalPageSpan.textContent = String(totalPages);
    }
    showPage(0);
    setupEventListeners();
}

// Show specific page
function showPage(index) {
    if (index < 0 || index >= totalPages) return;
    
    currentPage = index;
    
    // Update page visibility
    pages.forEach((page, i) => {
        page.classList.toggle('active', i === index);
    });
    
    // Update page indicator
    if (currentPageSpan) {
        currentPageSpan.textContent = index + 1;
    }
    
    // Update button states
    if (prevBtn) prevBtn.disabled = (index === 0);
    if (nextBtn) nextBtn.disabled = (index === totalPages - 1);
    
    // Stop all audio
    stopAllAudio();
    
    // Auto play audio if enabled
    if (autoPlayEnabled) {
        playCurrentPageAudio();
    }
}

// Navigation functions
function goToPrevPage() {
    if (currentPage > 0) {
        showPage(currentPage - 1);
    }
}

function goToNextPage() {
    if (currentPage < totalPages - 1) {
        showPage(currentPage + 1);
    }
}

// Audio functions
function playCurrentPageAudio() {
    const currentPageElement = pages[currentPage];
    const audio = currentPageElement.querySelector('.page-audio');
    
    if (audio) {
        audio.play().catch(err => {
            console.warn('Audio play failed:', err);
        });
        
        // Auto advance to next page when audio ends
        if (autoPlayEnabled) {
            audio.onended = () => {
                if (currentPage < totalPages - 1) {
                    setTimeout(() => {
                        goToNextPage();
                    }, 1000);
                } else {
                    toggleAutoPlay(); // Stop at the end
                }
            };
        }
    }
}

function stopAllAudio() {
    document.querySelectorAll('.page-audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function toggleAutoPlay() {
    autoPlayEnabled = !autoPlayEnabled;
    
    if (autoPlayEnabled) {
        if (autoPlayBtn) autoPlayBtn.innerHTML = '<span class="icon">⏸</span> 暂停播放';
        playCurrentPageAudio();
    } else {
        if (autoPlayBtn) autoPlayBtn.innerHTML = '<span class="icon">▶</span> 自动播放';
        stopAllAudio();
    }
}

// Fullscreen function
function toggleFullscreen() {
    const container = document.querySelector('.container');
    
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.warn('Fullscreen failed:', err);
        });
        if (fullscreenBtn) fullscreenBtn.innerHTML = '<span class="icon">⛶</span> 退出全屏';
    } else {
        document.exitFullscreen();
        if (fullscreenBtn) fullscreenBtn.innerHTML = '<span class="icon">⛶</span> 全屏';
    }
}

// Event listeners
function setupEventListeners() {
    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', goToPrevPage);
    if (nextBtn) nextBtn.addEventListener('click', goToNextPage);
    
    // Control buttons
    if (autoPlayBtn) autoPlayBtn.addEventListener('click', toggleAutoPlay);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                goToPrevPage();
                break;
            case 'ArrowRight':
                goToNextPage();
                break;
            case ' ':
                e.preventDefault();
                toggleAutoPlay();
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
        }
    });
    
    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next page
            goToNextPage();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right - previous page
            goToPrevPage();
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
