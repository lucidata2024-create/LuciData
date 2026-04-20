document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const revealItems = document.querySelectorAll(".reveal");
  const impactNumbers = document.querySelectorAll(".impact-number");
  const faqItems = document.querySelectorAll(".faq-item");
  const cursorGlow = document.querySelector(".cursor-glow");

  const testimonialTrack = document.getElementById("testimonialTrack");
  const testimonialCards = testimonialTrack ? testimonialTrack.querySelectorAll(".testimonial-card") : [];
  const prevButton = document.getElementById("prevTestimonial");
  const nextButton = document.getElementById("nextTestimonial");
  const dotsContainer = document.getElementById("testimonialDots");

  let currentTestimonial = 0;
  let testimonialInterval = null;

  /* =========================
     Sticky Header
     ========================= */
  const handleHeaderState = () => {
    if (window.scrollY > 16) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleHeaderState();
  window.addEventListener("scroll", handleHeaderState);

  /* =========================
     Mobile Menu
     ========================= */
  const closeMobileMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  };

  const openMobileMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.add("open");
    menuToggle.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });
  }

  /* =========================
     Smooth Scroll for Internal Links
     ========================= */
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const topPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

      window.scrollTo({
        top: topPosition,
        behavior: "smooth"
      });
    });
  });

  /* =========================
     Active Nav Link on Scroll
     ========================= */
  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + (header ? header.offsetHeight + 120 : 120);

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${sectionId}`
          );
        });
      }
    });
  };

  updateActiveNavLink();
  window.addEventListener("scroll", updateActiveNavLink);

  /* =========================
     Scroll Reveal Animations
     ========================= */
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("revealed"));
  }

  /* =========================
     Animated Counters
     ========================= */
  const animateCounter = (element) => {
    const target = Number(element.dataset.target || 0);
    const duration = 1800;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(target * easedProgress);

      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCount);
  };

  if ("IntersectionObserver" in window && impactNumbers.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = "true";
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.45
      }
    );

    impactNumbers.forEach((number) => counterObserver.observe(number));
  } else {
    impactNumbers.forEach((number) => {
      number.textContent = number.dataset.target || "0";
    });
  }

  /* =========================
     FAQ Accordion
     ========================= */
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        const otherQuestion = otherItem.querySelector(".faq-question");
        const otherAnswer = otherItem.querySelector(".faq-answer");

        otherItem.classList.remove("active");
        if (otherQuestion) {
          otherQuestion.setAttribute("aria-expanded", "false");
        }
        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  /* =========================
     Testimonial Slider
     ========================= */
  const buildTestimonialDots = () => {
    if (!dotsContainer || !testimonialCards.length) return;

    dotsContainer.innerHTML = "";

    testimonialCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "testimonial-dot";
      dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);

      if (index === currentTestimonial) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        goToTestimonial(index);
        restartTestimonialAutoplay();
      });

      dotsContainer.appendChild(dot);
    });
  };

  const updateTestimonialSlider = () => {
    if (!testimonialTrack || !testimonialCards.length) return;

    testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

    testimonialCards.forEach((card, index) => {
      card.classList.toggle("active", index === currentTestimonial);
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".testimonial-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentTestimonial);
      });
    }
  };

  const goToTestimonial = (index) => {
    if (!testimonialCards.length) return;

    const total = testimonialCards.length;
    currentTestimonial = (index + total) % total;
    updateTestimonialSlider();
  };

  const nextTestimonial = () => {
    goToTestimonial(currentTestimonial + 1);
  };

  const prevTestimonial = () => {
    goToTestimonial(currentTestimonial - 1);
  };

  const startTestimonialAutoplay = () => {
    if (!testimonialCards.length) return;

    testimonialInterval = setInterval(() => {
      nextTestimonial();
    }, 5500);
  };

  const restartTestimonialAutoplay = () => {
    if (testimonialInterval) {
      clearInterval(testimonialInterval);
    }
    startTestimonialAutoplay();
  };

  if (testimonialTrack && testimonialCards.length) {
    buildTestimonialDots();
    updateTestimonialSlider();
    startTestimonialAutoplay();

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        nextTestimonial();
        restartTestimonialAutoplay();
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        prevTestimonial();
        restartTestimonialAutoplay();
      });
    }
  }

  /* =========================
     Mouse Glow Effect
     ========================= */
  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (event) => {
      cursorGlow.style.transform = `translate(${event.clientX - 160}px, ${event.clientY - 160}px)`;
    });
  } else if (cursorGlow) {
    cursorGlow.style.display = "none";
  }

  /* =========================
     Demo Contact Form Feedback
     ========================= */
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (!submitButton) return;

      const originalText = submitButton.textContent;
      submitButton.textContent = "Inquiry Captured";
      submitButton.disabled = true;

      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2500);
    });
  }

  /* =========================
     Resize Handling for FAQ max-height
     ========================= */
  window.addEventListener("resize", () => {
    const activeFaq = document.querySelector(".faq-item.active .faq-answer");
    if (activeFaq) {
      activeFaq.style.maxHeight = `${activeFaq.scrollHeight}px`;
    }
  });
});
