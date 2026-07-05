document.addEventListener('DOMContentLoaded', () => {
  // 1. Hide Loader
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 600);
      }, 300);
    });

    // Fallback: If window.load doesn't fire fast, hide after 1.5 seconds
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }, 1500);
  }

  // 2. Initialize Lucide Icons if available
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    console.warn('Lucide library not loaded yet. Icons will initialize if library loads.');
  }

  // 2b. Dynamic Year Rendering for Footer
  const yearElements = document.querySelectorAll('.current-year');
  const currentYearVal = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYearVal;
  });

  // 3. Navbar Scrolling Effect
  const navbar = document.querySelector('.navbar');
  const backTopBtn = document.getElementById('backTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      if (navbar) navbar.classList.add('scrolled');
      if (backTopBtn) backTopBtn.classList.add('show');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
      if (backTopBtn) backTopBtn.classList.remove('show');
    }
  });

  // 4. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 5. Back To Top Action
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Number Counter Animation for Stats
  const statsSection = document.getElementById('statsSection');
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  const runCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 2000; // 2 seconds
      const increment = Math.ceil(target / (duration / 30));

      const updateCount = () => {
        count += increment;
        if (count >= target) {
          stat.textContent = target.toLocaleString() + suffix;
        } else {
          stat.textContent = count.toLocaleString() + suffix;
          setTimeout(updateCount, 30);
        }
      };

      updateCount();
    });
  };

  if (statsSection && statNumbers.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.2
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          runCounters();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    statsObserver.observe(statsSection);
  } else if (statNumbers.length > 0) {
    // Fallback if section element isn't present but numbers are
    runCounters();
  }

  // 7. Booking Form / Contact Form Submission (Mock Integration)
  const bookingForm = document.getElementById('bookingForm');
  const contactForm = document.getElementById('contactForm');
  const successBanner = document.getElementById('successBanner');

  const handleFormSubmit = (e, formType) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loader-ring" style="width:20px;height:20px;display:inline-block;margin:0;vertical-align:middle;"></span> Sending...';
    }

    // Simulate luxury workshop server network latency (1.5 seconds)
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }

      if (successBanner) {
        successBanner.style.display = 'block';
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Populate custom success details
        if (formType === 'booking') {
          successBanner.innerHTML = `
            <strong><i data-lucide="check-circle" style="color:#25d366;vertical-align:middle;margin-right:0.5rem;"></i> Booking Request Sent Successfully!</strong><br>
            Thank you for choosing Star Auto Service. Papau Bhai or Iqbal Bhai will contact you shortly on your provided phone number to confirm your luxury garage slot.
          `;
        } else {
          successBanner.innerHTML = `
            <strong><i data-lucide="check-circle" style="color:#25d366;vertical-align:middle;margin-right:0.5rem;"></i> Message Received!</strong><br>
            Thank you for contacting Star Auto Service. We appreciate your inquiry and will respond to your email or call within 1-2 working hours.
          `;
        }
        
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }

      e.target.reset();
    }, 1500);
  };

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => handleFormSubmit(e, 'booking'));
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));
  }

  // 8. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.service-card, .service-grid-card, .process-step, .faq-item, .choose-card, .emergency-container, .mechanic-card, .about-content, .about-image-wrapper, .contact-card, .map-container');
  
  if (revealElements.length > 0) {
    const revealObserverOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, revealObserverOptions);

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });
  }

  // 9. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          // Close all other items for a clean accordion effect
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
          
          // Toggle current item
          item.classList.toggle('active');
        });
      }
    });
  }

  // 10. Theme Toggling (Dark / Light Mode)
  const themeToggleBtns = document.querySelectorAll('#themeToggleBtn, #mobileThemeToggleBtn');
  const savedTheme = localStorage.getItem('starAutoTheme');
  
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-theme');
  } else {
    document.documentElement.classList.remove('light-theme');
  }

  themeToggleBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('starAutoTheme', isLight ? 'light' : 'dark');
        
        // Re-initialize Lucide Icons if available to ensure correct styles
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    }
  });

  // 11. Before/After Restorations Slider
  const sliders = document.querySelectorAll('.ba-slider');
  sliders.forEach(slider => {
    const range = slider.querySelector('.slider-range');
    const fg = slider.querySelector('.foreground-img');
    const button = slider.querySelector('.slider-button');

    if (range && fg && button) {
      range.addEventListener('input', (e) => {
        const sliderValue = e.target.value;
        fg.style.width = `${sliderValue}%`;
        button.style.left = `calc(${sliderValue}% - 20px)`;
      });
    }
  });

  // 12. Newsletter Global Form Handler
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailVal)) {
        if (newsletterFeedback) {
          newsletterFeedback.textContent = '❌ Please enter a valid email address.';
          newsletterFeedback.style.color = '#dc3545';
        }
        return;
      }

      const subscribeBtn = newsletterForm.querySelector('button');
      if (subscribeBtn) subscribeBtn.disabled = true;
      if (newsletterFeedback) {
        newsletterFeedback.textContent = '⏳ Processing subscription...';
        newsletterFeedback.style.color = 'var(--accent-gold)';
      }

      setTimeout(() => {
        // Save to Local Storage subscriber list
        const subscribers = JSON.parse(localStorage.getItem('starAutoSubscribers')) || [];
        subscribers.push({ email: emailVal, timestamp: new Date().toISOString() });
        localStorage.setItem('starAutoSubscribers', JSON.stringify(subscribers));

        newsletterForm.reset();
        if (newsletterFeedback) {
          newsletterFeedback.textContent = '✔ Thank you for subscribing! Check your inbox for updates.';
          newsletterFeedback.style.color = '#25d366';
        }
        if (subscribeBtn) subscribeBtn.disabled = false;
      }, 1000);
    });
  }
});
