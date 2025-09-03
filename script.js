 document.addEventListener('DOMContentLoaded', () => {
            const sliderTrack = document.getElementById('product-slider-track');
            const products = document.querySelectorAll('.product-card');
            const productCount = products.length;
            let currentIndex = 0;
            let intervalId;
            let isDragging = false;
            let startPos = 0;
            let currentTranslate = 0;
            let prevTranslate = 0;
            let animationFrameId;

            // Determines the number of products visible on screen
            const getVisibleProducts = () => {
                if (window.innerWidth >= 1024) {
                    return 3;
                } else if (window.innerWidth >= 300) {
                    return 2;
                } else {
                    return 1;
                }
            };

            // Sets the position of the slider track
            const setSliderPosition = () => {
                sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
            };

            // Moves to the next slide automatically
            const moveToNextSlide = () => {
                const visibleProducts = getVisibleProducts();
                // If we're at the end, jump back to the start
                if (currentIndex >= productCount - visibleProducts) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                const productWidth = products[0].offsetWidth;
                currentTranslate = -currentIndex * productWidth;
                setSliderPosition();
            };

            // Starts the automatic slider
            const startAutoSlide = () => {
                intervalId = setInterval(moveToNextSlide, 3000); // Slide every 3 seconds
            };

            // Stops the automatic slider
            const stopAutoSlide = () => {
                clearInterval(intervalId);
            };

            // Handles touch start and mouse down events
            const startDrag = (event) => {
                stopAutoSlide(); // Pause automatic sliding
                isDragging = true;
                sliderTrack.classList.add('dragging');
                startPos = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
                prevTranslate = currentTranslate;
                cancelAnimationFrame(animationFrameId);
            };

            // Handles touch move and mouse move events
            const drag = (event) => {
                if (!isDragging) return;
                const currentPos = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
                const diff = currentPos - startPos;
                currentTranslate = prevTranslate + diff;

                const visibleProducts = getVisibleProducts();
                const productWidth = products[0].offsetWidth;
                const maxTranslate = 0;
                const minTranslate = -(productWidth * (productCount - visibleProducts));

                // Restrict sliding to prevent going too far
                if (currentTranslate > maxTranslate) {
                    currentTranslate = maxTranslate;
                } else if (currentTranslate < minTranslate) {
                    currentTranslate = minTranslate;
                }
                
                animationFrameId = requestAnimationFrame(() => {
                    setSliderPosition();
                });
            };

            // Handles touch end and mouse up events
            const endDrag = () => {
                if (!isDragging) return;
                isDragging = false;
                sliderTrack.classList.remove('dragging');
                
                const visibleProducts = getVisibleProducts();
                const productWidth = products[0].offsetWidth;
                const movedBy = currentTranslate - prevTranslate;

                // Snap to the closest product based on drag direction and distance
                if (movedBy < -50 && currentIndex < productCount - visibleProducts) {
                    currentIndex++;
                } else if (movedBy > 50 && currentIndex > 0) {
                    currentIndex--;
                }

                currentTranslate = -currentIndex * productWidth;
                setSliderPosition();
                startAutoSlide(); // Resume automatic sliding
            };

            // Updates slider position on window resize
            window.addEventListener('resize', () => {
                stopAutoSlide();
                const productWidth = products[0].offsetWidth;
                currentTranslate = -currentIndex * productWidth;
                setSliderPosition();
                startAutoSlide();
            });

            // Add event listeners for touch
            sliderTrack.addEventListener('touchstart', startDrag);
            sliderTrack.addEventListener('touchmove', drag);
            sliderTrack.addEventListener('touchend', endDrag);

            // Add event listeners for mouse
            sliderTrack.addEventListener('mousedown', startDrag);
            sliderTrack.addEventListener('mousemove', drag);
            sliderTrack.addEventListener('mouseup', endDrag);
            sliderTrack.addEventListener('mouseleave', () => {
                if (isDragging) {
                    endDrag();
                }
            });

            // Initial setup
            setSliderPosition();
            startAutoSlide();
        });