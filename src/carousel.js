// src/carousel.js
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');

        if (!slides.length || !prevBtn || !nextBtn) return;

        let currentIndex = 0;

        function updateSlides() {
            slides.forEach((slide, index) => {
                if (index === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent accidental navigation if nested in an a-tag somehow
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateSlides();
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateSlides();
        });

        // Also allow clicking the active slide to advance to the next image (great for mobile)
        slides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                e.preventDefault();
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateSlides();
            });
        });
    });
});
