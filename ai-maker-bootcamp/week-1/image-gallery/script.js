// Fashion Gallery JavaScript

// Image data with categories
const images = [
    {
        src: 'imgs/pexels-ahcapture-34756565.jpg',
        photographer: 'AH Capture',
        category: 'street'
    },
    {
        src: 'imgs/pexels-alessio-cesario-975080-1906830.jpg',
        photographer: 'Alessio Cesario',
        category: 'portrait'
    },
    {
        src: 'imgs/pexels-aminnaderloei-34747812.jpg',
        photographer: 'Amin Naderloei',
        category: 'street'
    },
    {
        src: 'imgs/pexels-aminnaderloei-34748334.jpg',
        photographer: 'Amin Naderloei',
        category: 'street'
    },
    {
        src: 'imgs/pexels-diana-reyes-227887231-32628114.jpg',
        photographer: 'Diana Reyes',
        category: 'runway'
    },
    // {
    //     src: 'imgs/pexels-godisable-jacob-226636-1154861.jpg',
    //     photographer: 'Godisable Jacob',
    //     category: 'street'
    // },
    {
        src: 'imgs/pexels-godisable-jacob-226636-896293.jpg',
        photographer: 'Godisable Jacob',
        category: 'street'
    },
    {
        src: 'imgs/pexels-insynctmedia420i-3817723.jpg',
        photographer: 'InSynct Media',
        category: 'portrait'
    },
    {
        src: 'imgs/pexels-jay-soundo-2148060180-29940493.jpg',
        photographer: 'Jay Soundo',
        category: 'runway'
    },
    {
        src: 'imgs/pexels-kowalievska-1055691.jpg',
        photographer: 'Kowalievska',
        category: 'street'
    },
    {
        src: 'imgs/pexels-lance-reis-255748881-19797385.jpg',
        photographer: 'Lance Reis',
        category: 'runway'
    },
    {
        src: 'imgs/pexels-lucasmonteiro-1868471.jpg',
        photographer: 'Lucas Monteiro',
        category: 'street'
    },
    {
        src: 'imgs/pexels-mikoto-4132651.jpg',
        photographer: 'Mikoto',
        category: 'street'
    },
    {
        src: 'imgs/pexels-mohammad-gharib-2150556332-34769613.jpg',
        photographer: 'Mohammad Gharib',
        category: 'runway'
    },
    {
        src: 'imgs/pexels-pixabay-36469.jpg',
        photographer: 'Pixabay',
        category: 'portrait'
    },
    {
        src: 'imgs/pexels-sayantan-dhar-2154335308-34751178.jpg',
        photographer: 'Sayantan Dhar',
        category: 'street'
    },
    {
        src: 'imgs/pexels-vitoriasantos-3002552.jpg',
        photographer: 'Vitoria Santos',
        category: 'street'
    }
];

// DOM elements
const galleryGrid = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const imageCounter = document.getElementById('imageCounter');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadingSpinner = document.getElementById('loadingSpinner');

// State
let currentImageIndex = 0;
let currentFilter = 'all';
let filteredImages = [...images];

// Initialize gallery
function initGallery() {
    loadingSpinner.classList.add('active');
    
    // Render immediately for better perceived performance
    setTimeout(() => {
        renderGallery();
        loadingSpinner.classList.remove('active');
        
        // Preload visible images immediately
        setTimeout(() => preloadVisibleImages(), 50);
    }, 100);
}

// Render gallery
function renderGallery() {
    galleryGrid.innerHTML = '';
    
    filteredImages.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        galleryGrid.appendChild(galleryItem);
        
        // Stagger animation
        galleryItem.style.animationDelay = `${index * 0.05}s`;
    });
    
    // Initialize lazy loading after rendering
    initLazyLoading();
}

// Create gallery item
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-category', image.category);
    
    // Create image element with better loading
    const img = document.createElement('img');
    img.dataset.src = image.src; // Use data-src for lazy loading
    img.alt = `Photo by ${image.photographer}`;
    img.className = 'gallery-img';
    
    // Create placeholder/skeleton
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    
    const credit = document.createElement('div');
    credit.className = 'photographer-credit';
    credit.textContent = `Photo by ${image.photographer}`;
    
    item.appendChild(placeholder);
    item.appendChild(img);
    item.appendChild(credit);
    
    item.addEventListener('click', () => openLightbox(index));
    
    return item;
}

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter images
        currentFilter = filter;
        filterGallery(filter);
    });
});

function filterGallery(filter) {
    loadingSpinner.classList.add('active');
    
    setTimeout(() => {
        if (filter === 'all') {
            filteredImages = [...images];
        } else {
            filteredImages = images.filter(img => img.category === filter);
        }
        
        renderGallery();
        loadingSpinner.classList.remove('active');
        
        // Preload visible images after filtering
        setTimeout(() => preloadVisibleImages(), 50);
    }, 150);
}

// Lightbox functionality
function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateLightboxImage() {
    const image = filteredImages[currentImageIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = `Photo by ${image.photographer}`;
    imageCounter.textContent = `${currentImageIndex + 1} / ${filteredImages.length} — Photo by ${image.photographer}`;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    updateLightboxImage();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    updateLightboxImage();
}

// Event listeners
closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click', prevImage);

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowRight':
            nextImage();
            break;
        case 'ArrowLeft':
            prevImage();
            break;
    }
});

// Prevent image dragging in lightbox
lightboxImg.addEventListener('dragstart', (e) => e.preventDefault());

// Smooth scroll for page
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced lazy loading with Intersection Observer
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const placeholder = img.previousElementSibling;
                
                // Load the image
                if (img.dataset.src) {
                    // Preload image
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        img.src = tempImg.src;
                        img.classList.add('loaded');
                        if (placeholder && placeholder.classList.contains('image-placeholder')) {
                            placeholder.style.opacity = '0';
                            setTimeout(() => placeholder.remove(), 300);
                        }
                    };
                    tempImg.onerror = () => {
                        console.error(`Failed to load image: ${img.dataset.src}`);
                        if (placeholder) placeholder.remove();
                    };
                    tempImg.src = img.dataset.src;
                    delete img.dataset.src;
                }
                
                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, {
        root: null,
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.01
    });

    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Preload images in viewport and nearby on initial load
function preloadVisibleImages() {
    const images = document.querySelectorAll('.gallery-img');
    const viewportHeight = window.innerHeight;
    
    images.forEach(img => {
        const rect = img.getBoundingClientRect();
        // Preload if in viewport or within 200px below
        if (rect.top < viewportHeight + 200) {
            if (img.dataset.src) {
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = tempImg.src;
                    img.classList.add('loaded');
                    const placeholder = img.previousElementSibling;
                    if (placeholder && placeholder.classList.contains('image-placeholder')) {
                        placeholder.style.opacity = '0';
                        setTimeout(() => placeholder.remove(), 300);
                    }
                };
                tempImg.src = img.dataset.src;
                delete img.dataset.src;
            }
        }
    });
}

// Touch support for mobile swipe
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swiped left - next image
        nextImage();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swiped right - previous image
        prevImage();
    }
}

// Optimized scroll handler with debounce
let scrollTimeout;
window.addEventListener('scroll', () => {
    // Clear existing timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Debounce scroll events
    scrollTimeout = setTimeout(() => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                item.style.opacity = '1';
            }
        });
    }, 10);
}, { passive: true });

// Add hover sound effect (optional - disabled by default)
function addHoverEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Optional: Add subtle scale effect or sound
            item.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const handleResize = debounce(() => {
    // Re-render gallery on significant resize
    if (window.innerWidth !== window.lastWidth) {
        window.lastWidth = window.innerWidth;
        renderGallery();
    }
}, 250);

window.addEventListener('resize', handleResize);
window.lastWidth = window.innerWidth;

// Initialize the gallery when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
} else {
    initGallery();
}

// Export functions for potential future use
window.galleryAPI = {
    openLightbox,
    closeLightbox,
    filterGallery,
    nextImage,
    prevImage
};

