// --- Intersection Observer for Scroll Animations ---
// We use a progressive enhancement approach, where elements are hidden
// initially via CSS classes, and revealed as they enter the viewport.

const setupScrollAnimations = () => {
    // Elements that should fade in and move up
    const fadeUpElements = document.querySelectorAll('.fade-in-up');

    // Elements that should scale in
    const scaleElements = document.querySelectorAll('.scale-in');

    // Elements with text reveal effect
    const textRevealElements = document.querySelectorAll('.reveal-text');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is intersecting the viewport
            if (entry.isIntersecting) {
                // Add a class that triggers the CSS animation or transition
                entry.target.classList.add('is-visible');

                // Optional: stop observing once revealed for a one-time animation
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Note: For the initial load, elements in the hero section 
    // already have CSS animations applied directly via those classes 
    // (e.g. .fade-in-up) in style.css.

    // To handle elements lower on the page, we'd normally toggle 
    // an 'is-visible' class instead of playing it immediately.
    // For this prototype, the classes animate on load. To make them scroll-triggered,
    // we would modify the CSS to only animate when the `.is-visible` class is present.
};

const setupTiltAnimation = () => {
    const tiltContainer = document.getElementById('tilt-container');
    const tiltLogo = document.getElementById('tilt-logo');

    // Proceed only if the elements exist on the page
    if (!tiltContainer || !tiltLogo) return;

    let isSpinning = false;
    let currentRotationY = 0;

    tiltContainer.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        currentRotationY += 360;

        // Add smooth spinning transition
        tiltLogo.style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        tiltLogo.style.transform = `rotateX(0deg) rotateY(${currentRotationY}deg) scale3d(1.05, 1.05, 1.05)`;

        // Return to normal tracking state after animation
        setTimeout(() => {
            isSpinning = false;
            tiltLogo.style.transition = 'transform 0.1s ease-out';
        }, 1000);
    });

    tiltContainer.addEventListener('mousemove', (e) => {
        if (isSpinning) return;

        const rect = tiltContainer.getBoundingClientRect();

        // Calculate mouse position relative to the center of the container
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Mapping the position to rotation degrees (max 20 degree tilt)
        const rotateX = ((y - centerY) / centerY) * -20;
        const rotateY = ((x - centerX) / centerX) * 20 + currentRotationY;

        tiltLogo.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    tiltContainer.addEventListener('mouseleave', () => {
        if (isSpinning) return;
        // Smoothly return logo to original state when mouse leaves
        tiltLogo.style.transform = `rotateX(0deg) rotateY(${currentRotationY}deg) scale3d(1, 1, 1)`;
    });
};

const setupSizeSelectors = () => {
    const sizeContainers = document.querySelectorAll('.size-selector');

    sizeContainers.forEach(container => {
        const sizeBtns = container.querySelectorAll('.size-btn');

        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all buttons in this specific selector
                sizeBtns.forEach(b => b.classList.remove('active'));
                // Add active to the clicked button
                btn.classList.add('active');
            });
        });
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    setupTiltAnimation();
    setupSizeSelectors();

    // Initialize global header live time
    const updateLiveHeaderTime = () => {
        const timeElement = document.getElementById('live-time-header');
        if (!timeElement) return;

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        timeElement.textContent = `${dateStr} ${timeStr}`;
    };
    setInterval(updateLiveHeaderTime, 1000);
    updateLiveHeaderTime();

    console.log("Oblivion UI initialized.");
});


// --- Interactive 3D Logo Rotation Physics --- //
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.splash-logo');
    if (!logo) return; // Only run on index.html

    let isDragging = false;
    let startX = 0;

    // Physics variables
    let currentRotation = 0;
    let targetRotation = 0;

    // Sensitivity and Friction tuning
    const rotationSensitivity = 0.5; // How fast it spins relative to mouse distance
    const friction = 0.1; // Lower is slower/smoother. 1.0 is instant.

    // Disable default image dragging which conflicts with custom mouse logic
    logo.addEventListener('dragstart', (e) => e.preventDefault());

    // Mouse Tracking
    logo.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;

        // Add delta to target, then reset startX for continuous spinning
        targetRotation += deltaX * rotationSensitivity;
        startX = e.clientX;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Mobile Touch Support
    logo.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        targetRotation += deltaX * rotationSensitivity;
        startX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Animation Render Loop
    function updateRotation() {
        // Smoothly interpolate current towards target
        currentRotation += (targetRotation - currentRotation) * friction;

        // Apply 3D transform with a bit of perspective for depth
        logo.style.transform = `perspective(1000px) rotateY(${currentRotation}deg)`;

        requestAnimationFrame(updateRotation);
    }

    // Start Loop
    updateRotation();
});


// --- Mobile Hamburger Menu Toggle --- //
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const menuPanel = document.querySelector('.mobile-menu-panel');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');

    if (!hamburgerBtn || !menuPanel) return;

    function toggleMenu() {
        menuPanel.classList.toggle('active');
        menuOverlay.classList.toggle('active');

        // Prevent body scrolling when menu is open
        if (menuPanel.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    hamburgerBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);
});


// --- V13 Robust Sticky Mobile Header Scroll Physics --- //
document.addEventListener('DOMContentLoaded', () => {
    const stickyHeader = document.querySelector('.mobile-sticky-header');
    if (!stickyHeader) return;

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    // Listen on multiple targets just to be infinitely safe across iOS Safari/Chrome
    const scrollHandler = () => {
        let currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                // If scrolling down AND passed the 60px height of the bar, hide it by applying the CSS transform class
                if (currentScrollY > lastScrollY && currentScrollY > 60) {
                    stickyHeader.classList.add('header-hidden');
                } else {
                    // Scrolling up, reveal it
                    stickyHeader.classList.remove('header-hidden');
                }

                lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY; // For Mobile or negative scrolling
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    // Fallbacks
    document.addEventListener('scroll', scrollHandler, { passive: true });
    document.body.addEventListener('scroll', scrollHandler, { passive: true });
});
