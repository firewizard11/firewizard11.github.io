/*
	Antique Bookstore - Refactored from Strongly Typed by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

// DOM Elements
const DOM = {
  body: document.body,
  window: window,
  nav: document.getElementById('nav'),
  titleBar: null,
  navPanel: null
};

// Breakpoints
const breakpoints = {
  xlarge: ['1281px', '1680px'],
  large: ['981px', '1280px'],
  medium: ['737px', '980px'],
  small: [null, '736px']
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Remove preload class after a short delay
  window.setTimeout(() => {
    DOM.body.classList.remove('is-preload');
  }, 100);

  // Initialize mobile navigation
  initMobileNav();
  
  // Initialize slideshow
  initSlideshow();
});

// Initialize mobile navigation
function initMobileNav() {
  // Only create mobile nav if we're on a small screen or the nav exists
  if (window.innerWidth <= 980 && DOM.nav) {
    // Create title bar if it doesn't exist
    if (!DOM.titleBar) {
      DOM.titleBar = document.createElement('div');
      DOM.titleBar.id = 'titleBar';
      DOM.titleBar.innerHTML = '<a href="#navPanel" class="toggle"></a>';
      DOM.body.appendChild(DOM.titleBar);
    }

    // Create nav panel if it doesn't exist
    if (!DOM.navPanel) {
      DOM.navPanel = document.createElement('div');
      DOM.navPanel.id = 'navPanel';
      
      // Clone the navigation for mobile
      const navClone = DOM.nav.cloneNode(true);
      DOM.navPanel.innerHTML = '<nav>' + navClone.innerHTML + '</nav>';
      
      DOM.body.appendChild(DOM.navPanel);
      
      // Add event listeners for the toggle button
      const toggleButton = DOM.titleBar.querySelector('.toggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          DOM.body.classList.toggle('navPanel-visible');
        });
      }
      
      // Close panel when clicking outside
      document.addEventListener('click', (e) => {
        if (DOM.body.classList.contains('navPanel-visible') && 
            !DOM.navPanel.contains(e.target) && 
            !DOM.titleBar.contains(e.target)) {
          DOM.body.classList.remove('navPanel-visible');
        }
      });
    }
  }
}

// Initialize slideshow functionality
function initSlideshow() {
  const slideshowContainer = document.getElementById('catalogue-slideshow');
  if (!slideshowContainer) return;
  
  const slides = slideshowContainer.querySelectorAll('.slide');
  if (slides.length === 0) return;
  
  let currentSlideIndex = 0;

  // Function to show a specific slide
  function showSlide(index) {
    // Handle index boundaries
    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    // Hide all slides and show the current one
    slides.forEach((slide, i) => {
      slide.style.display = (i === currentSlideIndex) ? "flex" : "none";
      
      // Update ARIA attributes for accessibility
      slide.setAttribute('aria-hidden', i !== currentSlideIndex);
      
      // If this is the current slide, announce it for screen readers
      if (i === currentSlideIndex) {
        const title = slide.querySelector('h3')?.textContent || `Slide ${currentSlideIndex + 1}`;
        const liveRegion = document.getElementById('slideshow-live-region');
        if (liveRegion) {
          liveRegion.textContent = `Current slide: ${title}`;
        }
        
        // Update the counter
        const counter = document.getElementById('current-slide');
        if (counter) {
          counter.textContent = currentSlideIndex + 1;
        }
      }
    });
  }

  // Function to change slide
  function changeSlide(n) {
    showSlide(currentSlideIndex + n);
  }

  // Initialize the first slide
  showSlide(currentSlideIndex);

  // Add event listeners to navigation buttons
  const prevBtn = document.querySelector("#catalogue .prev");
  const nextBtn = document.querySelector("#catalogue .next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => changeSlide(-1));
    // Add keyboard support
    prevBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        changeSlide(-1);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener("click", () => changeSlide(1));
    // Add keyboard support
    nextBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        changeSlide(1);
      }
    });
  }

  // Add keyboard navigation for the slideshow
  slideshowContainer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      changeSlide(-1);
    } else if (e.key === "ArrowRight") {
      changeSlide(1);
    }
  });
  
  // Make the slideshow container focusable for keyboard navigation
  slideshowContainer.setAttribute('tabindex', '0');
  
  // Add touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  slideshowContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  slideshowContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next slide
      changeSlide(1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous slide
      changeSlide(-1);
    }
  }
  
  // Auto-advance slides every 5 seconds
  let slideInterval = setInterval(() => changeSlide(1), 5000);
  
  // Pause auto-advance when user interacts with slideshow
  slideshowContainer.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  slideshowContainer.addEventListener('mouseleave', () => {
    slideInterval = setInterval(() => changeSlide(1), 5000);
  });
  
  // Also pause on focus and touch
  slideshowContainer.addEventListener('focusin', () => {
    clearInterval(slideInterval);
  });
  
  slideshowContainer.addEventListener('focusout', () => {
    slideInterval = setInterval(() => changeSlide(1), 5000);
  });
  
  slideshowContainer.addEventListener('touchstart', () => {
    clearInterval(slideInterval);
  }, { passive: true });
}

// Handle window resize events
window.addEventListener('resize', () => {
  // Reinitialize mobile nav on resize
  initMobileNav();
});
