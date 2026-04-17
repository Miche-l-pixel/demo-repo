

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });


    // ── Hero Slideshow ──
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.getElementById('heroDots');
    let heroIndex = 0;
    let heroInterval;

    if (heroSlides.length > 1 && heroDots) {
        // Create dots
        heroSlides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('hero-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToHeroSlide(i));
            heroDots.appendChild(dot);
        });

        function goToHeroSlide(index) {
            heroSlides[heroIndex].classList.remove('active');
            heroDots.children[heroIndex].classList.remove('active');
            heroIndex = index;
            heroSlides[heroIndex].classList.add('active');
            heroDots.children[heroIndex].classList.add('active');
        }

        function nextHeroSlide() {
            goToHeroSlide((heroIndex + 1) % heroSlides.length);
        }

        // Auto-advance every 5s
        function startHeroAutoplay() {
            heroInterval = setInterval(nextHeroSlide, 5000);
        }
        startHeroAutoplay();

        // Pause on hover (desktop)
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => clearInterval(heroInterval));
            heroSection.addEventListener('mouseleave', startHeroAutoplay);
        }

        // Swipe support (mobile)
        let heroTouchX = 0;
        const heroEl = document.getElementById('heroSlideshow');
        if (heroEl) {
            heroEl.addEventListener('touchstart', (e) => {
                heroTouchX = e.changedTouches[0].screenX;
            }, { passive: true });
            heroEl.addEventListener('touchend', (e) => {
                const diff = heroTouchX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) {
                    clearInterval(heroInterval);
                    diff > 0
                        ? goToHeroSlide((heroIndex + 1) % heroSlides.length)
                        : goToHeroSlide((heroIndex - 1 + heroSlides.length) % heroSlides.length);
                    startHeroAutoplay();
                }
            }, { passive: true });
        }
    }


    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });


        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }


    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const suffix = counter.dataset.suffix || '';
            const noComma = counter.hasAttribute('data-no-comma');
            const duration = 2000;
            const startTime = performance.now();

            const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);
                const current = Math.floor(easedProgress * target);

                counter.textContent = (noComma ? current : current.toLocaleString()) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = (noComma ? target : target.toLocaleString()) + suffix;
                }
            };

            requestAnimationFrame(update);
        });
    };

    const statsSection = document.querySelector('.impact-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    const floats = document.querySelectorAll('.hero-float');
    if (floats.length && window.innerWidth > 768) {
        window.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            floats.forEach((f, i) => {
                const factor = (i + 1) * 0.5;
                f.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        }, { passive: true });
    }


    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    let currentSlide = 0;

    function updateCarousel() {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next', 'hidden');
            if (i === currentSlide) {
                slide.classList.add('active');
            } else if (i === (currentSlide - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            } else if (i === (currentSlide + 1) % slides.length) {
                slide.classList.add('next');
            } else {
                slide.classList.add('hidden');
            }
        });
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        updateCarousel();
    }

    if (slides.length > 0) {

        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }
        updateCarousel();
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));


        let touchStartX = 0;
        const track = document.getElementById('carouselTrack');
        if (track) {
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            track.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
                }
            }, { passive: true });
        }
    }


    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const donateBtn = document.getElementById('donateBtn');
    let selectedAmount = 1000;


    if (amountBtns.length) {
        amountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                amountBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedAmount = parseInt(btn.dataset.amount, 10);
                if (customAmountInput) customAmountInput.value = '';
            });
        });
    }


    if (customAmountInput) {
        customAmountInput.addEventListener('input', () => {
            const val = parseInt(customAmountInput.value, 10);
            if (val > 0) {
                amountBtns.forEach(b => b.classList.remove('active'));
                selectedAmount = val;
            }
        });
    }


    // ── Payment Result Modal Helper ──
    const paymentOverlay = document.getElementById('paymentOverlay');
    const paymentSuccess = document.getElementById('paymentSuccess');
    const paymentFailure = document.getElementById('paymentFailure');
    const paymentAmountText = document.getElementById('paymentAmountText');
    const paymentIdText = document.getElementById('paymentIdText');
    const paymentErrorText = document.getElementById('paymentErrorText');

    function showPaymentResult(type, data) {
        paymentSuccess.style.display = 'none';
        paymentFailure.style.display = 'none';

        if (type === 'success') {
            paymentAmountText.textContent = '₹' + data.amount.toLocaleString();
            paymentIdText.textContent = data.paymentId;
            paymentSuccess.style.display = 'block';
        } else {
            paymentErrorText.textContent = data.message || 'Something went wrong. Please try again.';
            paymentFailure.style.display = 'block';
        }

        paymentOverlay.classList.add('active');
    }

    function closePaymentModal() {
        paymentOverlay.classList.remove('active');
    }

    // Close modal handlers
    if (document.getElementById('paymentModalClose')) {
        document.getElementById('paymentModalClose').addEventListener('click', closePaymentModal);
    }
    if (document.getElementById('paymentDoneBtn')) {
        document.getElementById('paymentDoneBtn').addEventListener('click', closePaymentModal);
    }
    if (document.getElementById('paymentRetryBtn')) {
        document.getElementById('paymentRetryBtn').addEventListener('click', closePaymentModal);
    }
    if (paymentOverlay) {
        paymentOverlay.addEventListener('click', (e) => {
            if (e.target === paymentOverlay) closePaymentModal();
        });
    }

    // ── Razorpay Payment Gateway ──
    const RAZORPAY_BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwELN30yzu7s8oDl9jkmv0mg3ODJ2oHDybVmlJXzyNHCaXcmE6nZU7vunmCDHn2h023eQ/exec';
    const RAZORPAY_KEY_ID = 'rzp_live_SdKoTIc4JiZLkO';

    if (donateBtn) {
        donateBtn.addEventListener('click', async () => {
            const amount = customAmountInput && customAmountInput.value
                ? parseInt(customAmountInput.value, 10)
                : selectedAmount;

            if (!amount || amount < 1) {
                showPaymentResult('error', { message: 'Please select or enter a valid donation amount.' });
                return;
            }

            // Show loading state on button
            const originalText = donateBtn.innerHTML;
            donateBtn.innerHTML = '<i class="ph ph-spinner"></i> Processing...';
            donateBtn.disabled = true;

            try {
                // Step 1: Create order on server
                const orderResponse = await fetch(RAZORPAY_BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({
                        action: 'createOrder',
                        amount: amount * 100
                    })
                });

                const orderData = await orderResponse.json();

                if (orderData.error) {
                    throw new Error(orderData.error);
                }

                // Step 2: Open Razorpay Checkout with order_id
                const options = {
                    key: RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'Tiyasa Social Welfare Foundation',
                    description: 'Donation to Tiyasa Social Welfare Foundation',
                    image: 'https://tiyasafoundation.org/assets/logo.jpg',
                    order_id: orderData.order_id,
                    handler: async function (response) {
                        // Step 3: Verify payment signature on server
                        try {
                            const verifyResponse = await fetch(RAZORPAY_BACKEND_URL, {
                                method: 'POST',
                                headers: { 'Content-Type': 'text/plain' },
                                body: JSON.stringify({
                                    action: 'verifyPayment',
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });

                            const verifyData = await verifyResponse.json();

                            showPaymentResult('success', {
                                amount: amount,
                                paymentId: response.razorpay_payment_id
                            });

                            if (!verifyData.verified) {
                                console.warn('Payment signature verification failed');
                            }
                        } catch (verifyErr) {
                            // Payment went through but verification call failed
                            showPaymentResult('success', {
                                amount: amount,
                                paymentId: response.razorpay_payment_id
                            });
                            console.error('Verification error:', verifyErr);
                        }
                    },
                    prefill: {
                        name: document.getElementById('donorName') ? document.getElementById('donorName').value.trim() : undefined,
                        email: document.getElementById('donorEmail') ? document.getElementById('donorEmail').value.trim() : undefined,
                        contact: document.getElementById('donorPhone') ? document.getElementById('donorPhone').value.trim() : undefined
                    },
                    notes: {
                        purpose: 'Donation',
                        organization: 'Tiyasa Social Welfare Foundation',
                        name: document.getElementById('donorName') ? document.getElementById('donorName').value.trim() : '',
                        email: document.getElementById('donorEmail') ? document.getElementById('donorEmail').value.trim() : '',
                        phone: document.getElementById('donorPhone') ? document.getElementById('donorPhone').value.trim() : ''
                    },
                    theme: {
                        color: '#2F5D50'
                    },
                    modal: {
                        ondismiss: function () {
                            console.log('Razorpay checkout closed by user.');
                        }
                    }
                };

                const rzp = new Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    showPaymentResult('error', {
                        message: 'Payment failed: ' + response.error.description + '\n\nPlease try again.'
                    });
                });
                rzp.open();

            } catch (err) {
                showPaymentResult('error', {
                    message: 'Could not initiate payment: ' + err.message
                });
                console.error('Payment error:', err);
            } finally {
                donateBtn.innerHTML = originalText;
                donateBtn.disabled = false;
            }
        });
    }


    // ── Volunteer Modal ──
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwBdt7Q6ZKDpu5ysms549QJx1qpE-2QZ3jfUj-auLvcPNqyfM4g2i7Nc9uU05za-stx/exec';

    const volunteerBtn = document.getElementById('volunteerBtn');
    const volunteerOverlay = document.getElementById('volunteerOverlay');
    const volunteerModal = document.getElementById('volunteerModal');
    const volunteerClose = document.getElementById('volunteerClose');
    const volunteerForm = document.getElementById('volunteerForm');
    const volunteerSubmit = document.getElementById('volunteerSubmit');
    const volunteerSuccess = document.getElementById('volunteerSuccess');
    const volunteerSuccessClose = document.getElementById('volunteerSuccessClose');

    function openVolunteerModal() {
        if (!volunteerOverlay) return;
        volunteerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVolunteerModal() {
        if (!volunteerOverlay) return;
        volunteerOverlay.classList.remove('active');
        document.body.style.overflow = '';
        // Reset after animation
        setTimeout(() => {
            if (volunteerForm) volunteerForm.reset();
            if (volunteerSuccess) volunteerSuccess.style.display = 'none';
            if (volunteerForm) volunteerForm.style.display = '';
            if (volunteerSubmit) {
                volunteerSubmit.classList.remove('loading');
                volunteerSubmit.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Submit Application';
            }
            // Clear error states
            volunteerForm?.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
        }, 350);
    }

    if (volunteerBtn) volunteerBtn.addEventListener('click', openVolunteerModal);
    if (volunteerClose) volunteerClose.addEventListener('click', closeVolunteerModal);
    if (volunteerSuccessClose) volunteerSuccessClose.addEventListener('click', closeVolunteerModal);



    if (volunteerForm) {
        volunteerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            volunteerForm.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));

            // Validate required fields
            const name = document.getElementById('volName');
            const phone = document.getElementById('volPhone');
            const city = document.getElementById('volCity');
            const helpType = document.getElementById('volHelp');
            let hasError = false;

            [name, phone, city, helpType].forEach(field => {
                if (!field.value.trim()) {
                    field.closest('.form-group').classList.add('error');
                    hasError = true;
                }
            });

            if (hasError) {
                const firstError = volunteerForm.querySelector('.form-group.error input, .form-group.error select');
                if (firstError) firstError.focus();
                return;
            }

            // Show loading
            volunteerSubmit.classList.add('loading');
            volunteerSubmit.innerHTML = '<i class="ph ph-spinner"></i> Submitting...';

            const weekendRadio = volunteerForm.querySelector('input[name="weekends"]:checked');

            const formData = {
                name: name.value.trim(),
                phone: phone.value.trim(),
                email: document.getElementById('volEmail').value.trim(),
                city: city.value.trim(),
                helpType: helpType.value,
                weekends: weekendRadio ? weekendRadio.value : 'Sometimes',
                message: document.getElementById('volMessage').value.trim(),
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            };

            try {
                if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
                    const form = new FormData();
                    Object.entries(formData).forEach(([key, val]) => form.append(key, val));

                    await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        body: form
                    });
                } else {
                    // Demo mode — simulate a short delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log('Volunteer form data (demo mode):', formData);
                }

                // Show success
                volunteerForm.style.display = 'none';
                volunteerSuccess.style.display = '';
            } catch (err) {
                console.error('Submission error:', err);
                alert('Something went wrong. Please try again or contact us directly.');
                volunteerSubmit.classList.remove('loading');
                volunteerSubmit.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Submit Application';
            }
        });
    }
});
